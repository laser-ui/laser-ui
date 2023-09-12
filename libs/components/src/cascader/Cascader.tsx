import type { CascaderSearchPanelItem } from './internal/types';
import type { CascaderItem, CascaderProps, CascaderRef } from './types';
import type { DropdownItem } from '../dropdown/types';
import type { AbstractTreeNode } from '../tree/node/abstract-node';

import { useEvent, useEventCallback, useForkRef, useResize } from '@laser-ui/hooks';
import { findNested } from '@laser-ui/utils';
import { ReactComponent as CancelFilled } from '@material-design-icons/svg/filled/cancel.svg';
import { ReactComponent as CloseOutlined } from '@material-design-icons/svg/outlined/close.svg';
import { ReactComponent as KeyboardArrowDownOutlined } from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg';
import { ReactComponent as SearchOutlined } from '@material-design-icons/svg/outlined/search.svg';
import { isNull, isUndefined } from 'lodash';
import { createElement, forwardRef, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { CascaderPanel } from './internal/CascaderPanel';
import { CascaderSearchPanel } from './internal/CascaderSearchPanel';
import { CLASSES } from './vars';
import { Dropdown } from '../dropdown';
import {
  useComponentProps,
  useControlled,
  useDesign,
  useFocusVisible,
  useJSS,
  useLayout,
  useListenGlobalScrolling,
  useMaxIndex,
  useNamespace,
  useScopedProps,
  useStyled,
  useTranslation,
} from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { ROOT_DATA } from '../root/vars';
import { Tag } from '../tag';
import { MultipleTreeNode } from '../tree/node/multiple-node';
import { SingleTreeNode } from '../tree/node/single-node';
import { getTreeNodeLabel } from '../tree/utils';
import { TREE_NODE_KEY } from '../tree/vars';
import { getVerticalSidePosition, isPrintableCharacter, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';

function CascaderFC<V extends React.Key, T extends CascaderItem<V>>(
  props: CascaderProps<V, T>,
  ref: React.ForwardedRef<CascaderRef>,
): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    list,
    model,
    defaultModel,
    visible: visibleProp,
    defaultVisible,
    placeholder,
    multiple = false,
    searchable = false,
    searchValue: searchValueProp,
    defaultSearchValue,
    onlyLeafSelectable = true,
    clearable: clearableProp = false,
    loading = false,
    size: sizeProp,
    disabled: disabledProp = false,
    virtual = false,
    escClosable = true,
    customItem,
    customSelected,
    customSearch,
    inputRef: inputRefProp,
    inputRender,
    onModelChange,
    onVisibleChange,
    onSearch,
    onClear,
    onFirstFocus,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Cascader', props);

  const namespace = useNamespace();
  const styled = useStyled(
    CLASSES,
    { cascader: styleProvider?.cascader, 'cascader-popup': styleProvider?.['cascader-popup'] },
    styleOverrides,
  );
  const sheet = useJSS<'position'>();

  const { t } = useTranslation();

  const uniqueId = useId();
  const listId = `${namespace}-cascader-list-${uniqueId}`;
  const getItemId = (val: V) => `${namespace}-cascader-item-${val}-${uniqueId}`;

  const { pageScrollRef, contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const combineInputRef = useForkRef(inputRef, inputRefProp);
  const focusRef = useRef<any>(null);

  const dataRef = useRef<{
    itemFocused: Set<V>;
  }>({
    itemFocused: new Set(),
  });

  const [nodes, nodesMap] = useMemo(() => {
    const nodes = list.map((item) =>
      multiple
        ? new MultipleTreeNode(item, (origin) => origin.value, {
            disabled: item.disabled,
          })
        : new SingleTreeNode(item, (origin) => origin.value, {
            disabled: item.disabled,
          }),
    );

    const nodesMap = new Map<V, AbstractTreeNode<V, T>>();
    const reduceArr = (arr: AbstractTreeNode<V, T>[]) => {
      for (const item of arr) {
        nodesMap.set(item.id, item);
        if (item.children) {
          reduceArr(item.children);
        }
      }
    };
    reduceArr(nodes);

    return [nodes, nodesMap] as const;
  }, [list, multiple]);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);
  const [searchValue, changeSearchValue] = useControlled<string>(defaultSearchValue ?? '', searchValueProp, onSearch);

  const [_selected, changeSelected] = useControlled<V | null | V[]>(
    defaultModel ?? (multiple ? [] : null),
    model,
    (value) => {
      if (onModelChange) {
        if (multiple) {
          onModelChange(
            value,
            (value as V[]).map((v) => (nodesMap.get(v) as AbstractTreeNode<V, T>).origin),
          );
        } else {
          onModelChange(value, isNull(value) ? null : (nodesMap.get(value as V) as AbstractTreeNode<V, T>).origin);
        }
      }
    },
    undefined,
    formControl?.control,
  );
  const selected = useMemo(() => (multiple ? new Set(_selected as V[]) : (_selected as V | null)), [_selected, multiple]);
  const changeSelectedByClickWithoutSearch = (node: AbstractTreeNode<V, T>) => {
    if (multiple) {
      const checkeds = (node as MultipleTreeNode<V, T>).changeStatus(node.checked ? 'UNCHECKED' : 'CHECKED', selected as Set<V>);
      changeSelected(Array.from(checkeds.keys()));
    } else {
      if (node.isLeaf || !onlyLeafSelectable) {
        changeSelected(node.id);
      }
      if (node.isLeaf) {
        changeVisible(false);
      }
    }
  };
  const changeSelectedByClickWithSearch = (item: CascaderSearchPanelItem<V, T>) => {
    if (multiple) {
      const checkeds = (item[TREE_NODE_KEY] as MultipleTreeNode<V, T>).changeStatus(
        item[TREE_NODE_KEY].checked ? 'UNCHECKED' : 'CHECKED',
        selected as Set<V>,
      );
      changeSelected(Array.from(checkeds.keys()));
    } else {
      changeSelected(item[TREE_NODE_KEY].id);
      changeVisible(false);
    }
  };
  nodesMap.forEach((node) => {
    node.updateStatus(selected);
  });

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const hasSearch = searchValue.length > 0;
  const hasSelected = multiple ? (selected as Set<V>).size > 0 : !isNull(selected);
  const searchList = (() => {
    if (!hasSearch) {
      return [];
    }

    const filterFn = isUndefined(customSearch?.filter)
      ? (item: T) => item.label.includes(searchValue)
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (item: T) => customSearch!.filter!(searchValue, item);
    const sortFn = customSearch?.sort;

    const searchList: CascaderSearchPanelItem<V, T>[] = [];
    const reduceNodes = (nodes: AbstractTreeNode<V, T>[]) => {
      nodes.forEach((node) => {
        if ((!multiple && !onlyLeafSelectable) || node.isLeaf) {
          if (filterFn(node.origin)) {
            searchList.push({
              label: getTreeNodeLabel(node),
              value: node.id,
              disabled: node.disabled,
              [TREE_NODE_KEY]: node,
            });
          }
        }
        if (node.children) {
          reduceNodes(node.children);
        }
      });
    };
    reduceNodes(nodes);

    if (sortFn) {
      searchList.sort((a, b) => sortFn(a[TREE_NODE_KEY].origin, b[TREE_NODE_KEY].origin));
    }

    return searchList;
  })();

  const isEmpty = hasSearch ? searchList.length === 0 : nodes.length === 0;

  const [focusVisible, focusVisibleWrapper] = useFocusVisible(
    (code) => code.startsWith('Arrow') || ['Home', 'End', 'Enter', 'Space'].includes(code),
  );
  const [_itemFocusedWithoutSearch, setItemFocusedWithoutSearch] = useState<AbstractTreeNode<V, T> | undefined>();
  const changeItemFocusedWithoutSearch = (node: AbstractTreeNode<V, T>) => {
    if (!dataRef.current.itemFocused.has(node.id)) {
      dataRef.current.itemFocused.add(node.id);
      onFirstFocus?.(node.id, node.origin);
    }

    setItemFocusedWithoutSearch(node);
  };
  const itemFocusedWithoutSearch = (() => {
    if (_itemFocusedWithoutSearch) {
      const node = nodesMap.get(_itemFocusedWithoutSearch.id);
      if (node && node.enabled) {
        return node;
      }
    }

    if (hasSelected) {
      return findNested(nodes, (node) => node.enabled && node.checked);
    }
  })();
  const [_itemFocusedWithSearch, setItemFocusedWithSearch] = useState<CascaderSearchPanelItem<V, T> | undefined>();
  const changeItemFocusedWithSearch = (item: CascaderSearchPanelItem<V, T>) => {
    if (!dataRef.current.itemFocused.has(item.value)) {
      dataRef.current.itemFocused.add(item.value);
      onFirstFocus?.(item.value, item[TREE_NODE_KEY].origin);
    }

    setItemFocusedWithSearch(item);
  };
  const itemFocusedWithSearch = (() => {
    if (
      _itemFocusedWithSearch &&
      findNested(searchList, (item) => item[TREE_NODE_KEY].enabled && item.value === _itemFocusedWithSearch.value)
    ) {
      return _itemFocusedWithSearch;
    }

    if (hasSearch) {
      return findNested(searchList, (item) => item[TREE_NODE_KEY].enabled);
    }
  })();

  const maxZIndex = useMaxIndex(visible);
  const zIndex = `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  const transformOrigin = useRef<string>();
  const updatePosition = useEventCallback(() => {
    if (visible && boxRef.current && popupRef.current) {
      const height = popupRef.current.offsetHeight;
      const maxWidth = ROOT_DATA.windowSize.width - WINDOW_SPACE * 2;
      const width = Math.min(popupRef.current.scrollWidth, maxWidth);
      const position = getVerticalSidePosition(
        boxRef.current,
        { width, height },
        {
          placement: 'bottom-left',
          inWindow: WINDOW_SPACE,
        },
      );
      transformOrigin.current = position.transformOrigin;
      if (sheet.classes.position) {
        popupRef.current.classList.toggle(sheet.classes.position, false);
      }
      sheet.replaceRule('position', {
        top: position.top,
        left: position.left,
        maxWidth,
      });
      popupRef.current.classList.toggle(sheet.classes.position, true);
    }
  });

  const listenGlobalScrolling = useListenGlobalScrolling(updatePosition, !visible);
  useEvent(pageScrollRef, 'scroll', updatePosition, { passive: true }, !visible || listenGlobalScrolling);

  useResize(boxRef, updatePosition, undefined, !visible);
  useResize(popupRef, updatePosition, undefined, !visible);
  useResize(contentResizeRef, updatePosition, undefined, !visible);

  useImperativeHandle(
    ref,
    () => ({
      updatePosition,
    }),
    [updatePosition],
  );

  const preventBlur: React.MouseEventHandler = (e) => {
    if (document.activeElement === inputRef.current && e.target !== inputRef.current && e.button === 0) {
      e.preventDefault();
    }
  };

  const scrollCallback = useRef<() => void>();
  const inputable = searchable && visible;
  const clearable = clearableProp && hasSelected && !visible && !loading && !disabled;
  const inputNode = focusVisibleWrapper(
    createElement<any>(
      searchable ? 'input' : 'div',
      Object.assign(
        {
          ...mergeCS(styled('cascader__search'), {
            style: {
              opacity: inputable ? undefined : 0,
              zIndex: inputable ? undefined : -1,
            },
          }),
          ...formControl?.inputAria,
          ref: combineInputRef,
          tabIndex: disabled ? -1 : 0,
          role: 'combobox',
          'aria-haspopup': 'listbox',
          'aria-expanded': visible,
          'aria-controls': listId,
          onBlur: () => {
            changeVisible(false);
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.code === 'Escape') {
              if (visible && escClosable) {
                e.stopPropagation();
                e.preventDefault();
                changeVisible(false);
              }
            } else {
              const focusItem = (code: 'next' | 'prev' | 'first' | 'last' | 'prev-level' | 'next-level') => {
                if (focusRef.current) {
                  const item = focusRef.current(code);

                  if (item) {
                    hasSearch ? changeItemFocusedWithSearch(item) : changeItemFocusedWithoutSearch(item);

                    if (virtual === false && !code.includes('level')) {
                      scrollCallback.current = () => {
                        const el = document.getElementById(getItemId(hasSearch ? item.value : item.id));
                        if (el) {
                          focusRef.current(el);
                        }
                      };
                      if (visible) {
                        scrollCallback.current();
                        scrollCallback.current = undefined;
                      }
                    }
                  }
                }
              };
              if (visible) {
                switch (e.code) {
                  case 'ArrowUp': {
                    e.preventDefault();
                    focusItem('prev');
                    break;
                  }

                  case 'ArrowDown': {
                    e.preventDefault();
                    focusItem('next');
                    break;
                  }

                  case 'ArrowLeft': {
                    if (!hasSearch) {
                      e.preventDefault();
                      focusItem('prev-level');
                    }
                    break;
                  }

                  case 'ArrowRight': {
                    if (!hasSearch) {
                      e.preventDefault();
                      focusItem('next-level');
                    }
                    break;
                  }

                  case 'Home': {
                    e.preventDefault();
                    focusItem('first');
                    break;
                  }

                  case 'End': {
                    e.preventDefault();
                    focusItem('last');
                    break;
                  }

                  default: {
                    if (e.code === 'Enter' || (e.code === 'Space' && !searchable)) {
                      e.preventDefault();
                      if (hasSearch) {
                        if (itemFocusedWithSearch) {
                          changeSelectedByClickWithSearch(itemFocusedWithSearch);
                        }
                      } else {
                        if (itemFocusedWithoutSearch) {
                          changeSelectedByClickWithoutSearch(itemFocusedWithoutSearch);
                        }
                      }
                    }
                    break;
                  }
                }
              } else if (!(searchable && ['Home', 'End', 'Enter', 'Space'].includes(e.code))) {
                switch (e.code) {
                  case 'End':
                  case 'ArrowUp': {
                    e.preventDefault();
                    changeVisible(true);
                    focusItem('last');
                    break;
                  }

                  case 'Home':
                  case 'ArrowDown': {
                    e.preventDefault();
                    changeVisible(true);
                    focusItem('first');
                    break;
                  }

                  case 'Enter':
                  case 'Space': {
                    e.preventDefault();
                    changeVisible(true);
                    break;
                  }

                  default: {
                    if (isPrintableCharacter(e.key)) {
                      changeVisible(true);
                    }
                    break;
                  }
                }
              }
            }
          },
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (searchable) {
              changeSearchValue(e.currentTarget.value);
            }
          },
        },
        searchable
          ? {
              type: 'text',
              value: searchValue,
              autoComplete: 'off',
              disabled,
            }
          : {},
      ),
    ),
  );

  const [selectedNode, suffixNode, selectedLabel] = (() => {
    let selectedNode: React.ReactNode = null;
    let suffixNode: React.ReactNode = null;
    let selectedLabel: string | undefined;
    if (multiple) {
      const selectedNodes: MultipleTreeNode<V, T>[] = [];
      for (const v of _selected as V[]) {
        const node = nodesMap.get(v);
        if (node) {
          selectedNodes.push(node as MultipleTreeNode<V, T>);
        }
      }

      suffixNode = (
        <Dropdown
          list={selectedNodes.map<DropdownItem<V> & { node: MultipleTreeNode<V, T> }>((node) => {
            const { value: itemValue, disabled: itemDisabled } = node.origin;
            const title = customSelected ? customSelected(node.origin) : getTreeNodeLabel(node);

            return {
              id: itemValue,
              title,
              type: 'item',
              disabled: itemDisabled,
              node,
            };
          })}
          onClick={(id, item) => {
            const checkeds = (item.node as MultipleTreeNode<V, T>).changeStatus('UNCHECKED', selected as Set<V>);
            changeSelected(Array.from(checkeds.keys()));
            return false;
          }}
        >
          <Tag tabIndex={-1} size={size}>
            {(selected as Set<V>).size}
          </Tag>
        </Dropdown>
      );
      selectedNode = selectedNodes.map((node) => (
        <Tag key={node.id} size={size}>
          {customSelected ? customSelected(node.origin) : node.origin.label}
          {!(node.disabled || disabled) && (
            <div
              {...styled('cascader__close')}
              role="button"
              aria-label={t('Close')}
              onClick={(e) => {
                e.stopPropagation();

                const checkeds = (node as MultipleTreeNode<V, T>).changeStatus('UNCHECKED', selected as Set<V>);
                changeSelected(Array.from(checkeds.keys()));
              }}
            >
              <Icon>
                <CloseOutlined />
              </Icon>
            </div>
          )}
        </Tag>
      ));
    } else {
      if (!isNull(selected)) {
        const node = nodesMap.get(selected as V);
        if (node) {
          selectedLabel = getTreeNodeLabel(node);
          selectedNode = customSelected ? customSelected(node.origin) : selectedLabel;
        }
      }
    }
    return [selectedNode, suffixNode, selectedLabel];
  })();

  const designProps = useDesign({ compose: { disabled }, form: formControl });

  return (
    <>
      <div
        {...restProps}
        {...mergeCS(
          styled('cascader', `cascader--${size}`, {
            'cascader.is-expanded': visible,
            'cascader.is-disabled': disabled,
          }),
          {
            className: restProps.className,
            style: restProps.style,
          },
        )}
        {...designProps}
        ref={boxRef}
        onMouseDown={(e) => {
          restProps.onMouseDown?.(e);

          preventBlur(e);
        }}
        onMouseUp={(e) => {
          restProps.onMouseUp?.(e);

          preventBlur(e);
        }}
        onClick={(e) => {
          restProps.onClick?.(e);

          inputRef.current?.focus({ preventScroll: true });
          changeVisible((draft) => (searchable ? true : !draft));
        }}
      >
        <div {...styled('cascader__container')} title={selectedLabel}>
          {inputRender ? inputRender(inputNode) : inputNode}
          {!inputable &&
            (hasSelected ? (
              <div {...styled('cascader__content')}>{selectedNode}</div>
            ) : placeholder ? (
              <div {...styled('cascader__placeholder-wrapper')}>
                <div {...styled('cascader__placeholder')}>{placeholder}</div>
              </div>
            ) : null)}
        </div>
        {multiple && (
          <div
            {...styled('cascader__multiple-count')}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {suffixNode}
          </div>
        )}
        {clearable && (
          <div
            {...styled('cascader__clear')}
            role="button"
            aria-label={t('Clear')}
            onClick={(e) => {
              e.stopPropagation();

              onClear?.();

              if (multiple) {
                changeSelected([]);
              } else {
                changeSelected(null);
              }
            }}
          >
            <Icon>
              <CancelFilled />
            </Icon>
          </div>
        )}
        <div
          {...mergeCS(styled('cascader__icon'), {
            style: { visibility: clearable ? 'hidden' : undefined },
          })}
        >
          <Icon>
            {loading ? <CircularProgress /> : inputable ? <SearchOutlined /> : <KeyboardArrowDownOutlined {...styled('cascader__arrow')} />}
          </Icon>
        </div>
      </div>
      <Portal
        selector={() => {
          let el = document.getElementById(`${namespace}-cascader-root`);
          if (!el) {
            el = document.createElement('div');
            el.id = `${namespace}-cascader-root`;
            document.body.appendChild(el);
          }
          return el;
        }}
      >
        <Transition
          enter={visible}
          during={TTANSITION_DURING_POPUP}
          afterRender={() => {
            updatePosition();
            scrollCallback.current?.();
            scrollCallback.current = undefined;
          }}
          afterEnter={() => {
            afterVisibleChange?.(true);
          }}
          afterLeave={() => {
            afterVisibleChange?.(false);
          }}
        >
          {(state) => {
            let transitionStyle: React.CSSProperties = {};
            switch (state) {
              case 'enter':
                transitionStyle = { transform: 'scaleY(0.7)', opacity: 0 };
                break;

              case 'entering':
                transitionStyle = {
                  transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-out`).join(', '),
                  transformOrigin: transformOrigin.current,
                };
                break;

              case 'leaving':
                transitionStyle = {
                  transform: 'scaleY(0.7)',
                  opacity: 0,
                  transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-in`).join(', '),
                  transformOrigin: transformOrigin.current,
                };
                break;

              case 'leaved':
                transitionStyle = { display: 'none' };
                break;

              default:
                break;
            }

            return (
              <div
                {...mergeCS(styled('cascader-popup'), {
                  style: {
                    zIndex,
                    ...transitionStyle,
                  },
                })}
                ref={popupRef}
                onMouseDown={(e) => {
                  preventBlur(e);
                }}
                onMouseUp={(e) => {
                  preventBlur(e);
                }}
              >
                {loading && (
                  <div
                    {...styled('cascader-popup__loading', {
                      'cascader-popup__loading--empty': isEmpty,
                    })}
                  >
                    <Icon>
                      <CircularProgress />
                    </Icon>
                  </div>
                )}
                {loading && isEmpty ? null : hasSearch ? (
                  <CascaderSearchPanel
                    ref={focusRef}
                    namespace={namespace}
                    styled={styled}
                    id={listId}
                    list={searchList}
                    customItem={customItem}
                    itemId={getItemId}
                    itemFocused={itemFocusedWithSearch}
                    multiple={multiple}
                    onlyLeafSelectable={onlyLeafSelectable}
                    virtual={virtual}
                    focusVisible={focusVisible}
                    onClick={(item) => {
                      changeItemFocusedWithSearch(item);
                      changeSelectedByClickWithSearch(item);
                    }}
                  />
                ) : (
                  <CascaderPanel
                    ref={focusRef}
                    namespace={namespace}
                    styled={styled}
                    id={listId}
                    list={nodes}
                    customItem={customItem}
                    itemId={getItemId}
                    itemSelected={!multiple && hasSelected ? nodesMap.get(selected as V) : undefined}
                    itemFocused={itemFocusedWithoutSearch}
                    multiple={multiple}
                    virtual={virtual}
                    focusVisible={focusVisible}
                    onFocus={changeItemFocusedWithoutSearch}
                    onClick={changeSelectedByClickWithoutSearch}
                  />
                )}
              </div>
            );
          }}
        </Transition>
      </Portal>
    </>
  );
}

export const Cascader: <ID extends React.Key, T extends CascaderItem<ID>>(
  props: CascaderProps<ID, T> & React.RefAttributes<CascaderRef>,
) => ReturnType<typeof CascaderFC> = forwardRef(CascaderFC) as any;
