/* eslint-disable @typescript-eslint/no-empty-function */
import type { CascaderSearchPanelItem } from './internal/types';
import type { CascaderItem, CascaderProps } from './types';
import type { BaseInputProps } from '../base-input';
import type { DropdownItem } from '../dropdown/types';
import type { AbstractTreeNode } from '../tree/node/abstract-node';

import { useEventCallback, useResize } from '@laser-ui/hooks';
import { findNested, setRef } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { isNull, isUndefined } from 'lodash';
import { useId, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { CascaderPanel } from './internal/CascaderPanel';
import { CascaderSearchPanel } from './internal/CascaderSearchPanel';
import { CLASSES } from './vars';
import { BaseInput } from '../base-input';
import { CircularProgress } from '../circular-progress';
import { Dropdown } from '../dropdown';
import {
  useComponentProps,
  useContainerScrolling,
  useControlled,
  useDesign,
  useFocusVisible,
  useLayout,
  useNamespace,
  useScopedProps,
  useStyled,
  useTranslation,
  useZIndex,
} from '../hooks';
import { Icon } from '../icon';
import { Portal } from '../internal/portal';
import { ROOT_DATA } from '../root/vars';
import { Tag } from '../tag';
import { Transition } from '../transition';
import { MultipleTreeNode } from '../tree/node/multiple-node';
import { SingleTreeNode } from '../tree/node/single-node';
import { getTreeNodeLabel } from '../tree/utils';
import { TREE_NODE_KEY } from '../tree/vars';
import { getVerticalSidePosition, isPrintableCharacter, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';

export function Cascader<V extends React.Key, T extends CascaderItem<V>>(props: CascaderProps<V, T>): React.ReactElement | null {
  const {
    ref,
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
    inputProps,
    popupRender,
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

  const { t } = useTranslation();

  const uniqueId = useId();
  const listId = `${namespace}-cascader-list-${uniqueId}`;
  const getItemId = (val: V) => `${namespace}-cascader-item-${val}-${uniqueId}`;

  const { contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusRef = useRef<any>(null);

  const itemFocused = useRef(new Set<V>());

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

  const [focusVisible, focusVisibleProps] = useFocusVisible(
    (code) => code.startsWith('Arrow') || ['Home', 'End', 'Enter', 'Space'].includes(code),
  );
  const [_itemFocusedWithoutSearch, setItemFocusedWithoutSearch] = useState<AbstractTreeNode<V, T> | undefined>();
  const changeItemFocusedWithoutSearch = (node: AbstractTreeNode<V, T>) => {
    if (!itemFocused.current.has(node.id)) {
      itemFocused.current.add(node.id);
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
    if (!itemFocused.current.has(item.value)) {
      itemFocused.current.add(item.value);
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

  const zIndexValue = useZIndex(visible);
  const zIndex = `calc(var(--${namespace}-zindex-fixed) + ${zIndexValue})`;

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
      popupRef.current.style.setProperty(`--popup-down-transform-origin`, position.transformOrigin);
      popupRef.current.style.top = position.top + 'px';
      popupRef.current.style.left = position.left + 'px';
      popupRef.current.style.maxWidth = maxWidth + 'px';
    }
  });

  useContainerScrolling(boxRef, updatePosition, !visible);

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

  const scrollCallback = useRef(() => {});
  const inputable = searchable && visible;
  const clearable = clearableProp && hasSelected && !visible && !loading && !disabled;

  const [selectedNode, suffixNode, selectedLabel] = (() => {
    let selectedNode: React.ReactNode = null;
    let suffixNode: React.ReactNode = null;
    let selectedLabel: string | undefined;
    if (multiple) {
      const selectedNodes = (_selected as V[]).map<{ value: V; label: string; node?: MultipleTreeNode<V, T> }>((value) => {
        const node = nodesMap.get(value) as MultipleTreeNode<V, T> | undefined;
        return {
          value,
          label: customSelected ? customSelected(value, node?.origin) : node ? node.origin.label : String(value),
          node,
        };
      });

      suffixNode = (
        <Dropdown<V, DropdownItem<V>>
          list={selectedNodes.map(({ value, label, node }) => ({
            id: value,
            title: label,
            type: 'item',
            disabled: node?.origin.disabled,
          }))}
          virtual={virtual}
          onClick={(id) => {
            changeSelected((draft) => {
              (draft as V[]).splice(
                (draft as V[]).findIndex((v) => v === id),
                1,
              );
            });
            return false;
          }}
        >
          {(dropdownProps) => (
            <Tag {...dropdownProps} tabIndex={-1} size={size}>
              {(selected as Set<V>).size}
            </Tag>
          )}
        </Dropdown>
      );
      selectedNode = selectedNodes.map(({ value, label, node }) => (
        <Tag key={value} size={size}>
          {label}
          {!(node?.disabled || disabled) && (
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
        selectedNode = selectedLabel = customSelected
          ? customSelected(selected as V, node?.origin)
          : node
            ? getTreeNodeLabel(node)
            : String(selected);
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
        ref={(instance) => {
          boxRef.current = instance;
          return () => {
            boxRef.current = null;
          };
        }}
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
          {(() => {
            const nodeProps: any = Object.assign(
              {
                ...inputProps,
                ...mergeCS(styled('cascader__search'), {
                  style: {
                    opacity: inputable ? undefined : 0,
                    zIndex: inputable ? undefined : -1,
                  },
                }),
                ...formControl?.inputAria,
                ref: (instance) => {
                  inputRef.current = instance;
                  const ret = setRef(inputProps?.ref, instance);
                  return () => {
                    inputRef.current = null;
                    ret();
                  };
                },
                tabIndex: disabled ? -1 : 0,
                role: 'combobox',
                'aria-haspopup': 'listbox',
                'aria-expanded': visible,
                'aria-controls': listId,
                onFocus: (e) => {
                  inputProps?.onFocus?.(e);
                  focusVisibleProps.onFocus(e);
                },
                onBlur: (e) => {
                  inputProps?.onBlur?.(e);
                  focusVisibleProps.onBlur(e);

                  changeVisible(false);
                },
                onKeyDown: (e) => {
                  inputProps?.onKeyDown?.(e);
                  focusVisibleProps.onKeyDown(e);

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
                              scrollCallback.current = () => {};
                              const el = document.getElementById(getItemId(hasSearch ? item.value : item.id));
                              if (el) {
                                focusRef.current(el);
                              }
                            };
                            if (visible) {
                              scrollCallback.current();
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
              } as React.ComponentPropsWithRef<'input'>,
              searchable
                ? ({
                    type: 'text',
                    value: searchValue,
                    autoComplete: 'off',
                    disabled,
                    onValueChange: (val) => {
                      changeSearchValue(val);
                    },
                  } as BaseInputProps)
                : {},
            );
            return searchable ? <BaseInput {...nodeProps} /> : <div {...nodeProps} />;
          })()}
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
          name={`${namespace}-popup-down`}
          duration={TTANSITION_DURING_POPUP}
          onSkipEnter={() => {
            updatePosition();
            scrollCallback.current();
          }}
          onBeforeEnter={() => {
            updatePosition();
            scrollCallback.current();
          }}
          onAfterEnter={() => {
            afterVisibleChange?.(true);
          }}
          onAfterLeave={() => {
            afterVisibleChange?.(false);
          }}
        >
          {(transitionRef, leaved) => (
            <div
              {...mergeCS(styled('cascader-popup'), {
                style: {
                  zIndex,
                  ...(leaved ? { display: 'none' } : undefined),
                },
              })}
              ref={(instance) => {
                popupRef.current = instance;
                transitionRef(instance);
                return () => {
                  popupRef.current = null;
                  transitionRef(null);
                };
              }}
              onMouseDown={(e) => {
                preventBlur(e);
              }}
              onMouseUp={(e) => {
                preventBlur(e);
              }}
            >
              {(() => {
                const el = (
                  <div {...styled('cascader-popup__content')}>
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
                        ref={(instance) => {
                          focusRef.current = instance;
                          return () => {
                            focusRef.current = null;
                          };
                        }}
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
                        ref={(instance) => {
                          focusRef.current = instance;
                          return () => {
                            focusRef.current = null;
                          };
                        }}
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
                return popupRender ? popupRender(el) : el;
              })()}
            </div>
          )}
        </Transition>
      </Portal>
    </>
  );
}
