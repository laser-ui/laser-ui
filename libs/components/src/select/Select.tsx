import type { SelectItem, SelectProps, SelectRef } from './types';
import type { DropdownItem } from '../dropdown/types';
import type { VirtualScrollOptimization } from '../virtual-scroll/types';

import { useEvent, useEventCallback, useForkRef, useResize } from '@laser-ui/hooks';
import { findNested, scrollIntoViewIfNeeded } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { isNull, isNumber, isUndefined } from 'lodash';
import { createElement, forwardRef, useCallback, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { CLASSES, IS_CREATED } from './vars';
import { Checkbox } from '../checkbox';
import { Dropdown } from '../dropdown';
import { Empty } from '../empty';
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
import { getVerticalSidePosition, isPrintableCharacter, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';
import { VirtualScroll, type VirtualScrollRef } from '../virtual-scroll';

function SelectFC<V extends React.Key, T extends SelectItem<V>>(
  props: SelectProps<V, T>,
  ref: React.ForwardedRef<SelectRef>,
): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    list: listProp,
    model,
    defaultModel,
    visible: visibleProp,
    defaultVisible,
    placeholder,
    multiple = false,
    searchable = false,
    searchValue: searchValueProp,
    defaultSearchValue,
    clearable: clearableProp = false,
    loading = false,
    size: sizeProp,
    disabled: disabledProp = false,
    monospaced = true,
    virtual = false,
    escClosable = true,
    customItem,
    customSelected,
    customSearch,
    createItem,
    inputRef: inputRefProp,
    inputRender,
    popupRender,
    onModelChange,
    onVisibleChange,
    onSearch,
    onClear,
    onCreateItem,
    onScrollBottom,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Select', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { select: styleProvider?.select, 'select-popup': styleProvider?.['select-popup'] }, styleOverrides);
  const sheet = useJSS<'position'>();

  const { t } = useTranslation();

  const uniqueId = useId();
  const listId = `${namespace}-select-list-${uniqueId}`;
  const getItemId = (val: V) => `${namespace}-select-item-${val}-${uniqueId}`;

  const { pageScrollRef, contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const combineInputRef = useForkRef(inputRef, inputRefProp);
  const vsRef = useRef<VirtualScrollRef<T>>(null);

  const itemsMap = useMemo(() => {
    const items = new Map<V, T>();
    const reduceArr = (arr: T[]) => {
      for (const item of arr) {
        items.set(item.value, item);
        if (item.children) {
          reduceArr(item.children as T[]);
        }
      }
    };
    reduceArr(listProp);
    return items;
  }, [listProp]);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);
  const [searchValue, changeSearchValue] = useControlled<string>(defaultSearchValue ?? '', searchValueProp, onSearch);

  const canSelectedItem = useCallback((item: T) => !item.disabled && !item.children, []);

  const [_selected, changeSelected] = useControlled<V | null | V[]>(
    defaultModel ?? (multiple ? [] : null),
    model,
    (value) => {
      if (onModelChange) {
        if (multiple) {
          onModelChange(
            value,
            (value as V[]).map((v) => itemsMap.get(v)),
          );
        } else {
          onModelChange(value, isNull(value) ? null : itemsMap.get(value as V));
        }
      }
    },
    undefined,
    formControl?.control,
  );
  const selected = useMemo(() => (multiple ? new Set(_selected as V[]) : (_selected as V | null)), [_selected, multiple]);
  const changeSelectedByClick = (val: V) => {
    if (multiple) {
      changeSelected((draft) => {
        const index = (draft as V[]).findIndex((v) => v === val);
        if (index !== -1) {
          (draft as V[]).splice(index, 1);
        } else {
          (draft as V[]).push(val);
        }
      });
    } else {
      changeSelected(val);
      changeVisible(false);
    }
  };

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

    let itemCreated = createItem?.(searchValue);
    if (itemCreated) {
      itemCreated = {
        ...itemCreated,
        [IS_CREATED]: true,
      };
    }

    let searchList: (T & { [IS_CREATED]?: boolean })[] = [];

    listProp.forEach((item) => {
      if (!item.children) {
        if (itemCreated && item.value === itemCreated.value) {
          itemCreated = undefined;
        }
        if (filterFn(item)) {
          searchList.push(item);
        }
      } else {
        const groupList: T[] = [];
        (item.children as T[]).forEach((groupItem) => {
          if (itemCreated && groupItem.value === itemCreated.value) {
            itemCreated = undefined;
          }
          if (filterFn(groupItem)) {
            groupList.push(groupItem);
          }
        });
        searchList = searchList.concat(groupList);
      }
    });

    if (sortFn) {
      searchList.sort(sortFn);
    }

    if (itemCreated) {
      searchList.unshift(itemCreated);
    }

    return searchList;
  })();
  const list = hasSearch ? searchList : listProp;

  const [focusVisible, focusVisibleWrapper] = useFocusVisible(
    (code) => code.startsWith('Arrow') || ['Home', 'End', 'Enter', 'Space'].includes(code),
  );
  const [_itemFocusedWithoutSearch, setItemFocusedWithoutSearch] = useState<T | undefined>();
  const itemFocusedWithoutSearch = (() => {
    let itemFocused: T | undefined;

    if (_itemFocusedWithoutSearch) {
      itemFocused = itemsMap.get(_itemFocusedWithoutSearch.value);
      if (itemFocused && canSelectedItem(itemFocused)) {
        return itemFocused;
      }
    }

    if (hasSelected) {
      itemFocused = findNested(listProp, (item) =>
        canSelectedItem(item) && multiple ? (selected as Set<V>).has(item.value) : (selected as V) === item.value,
      );
    }

    if (isUndefined(itemFocused)) {
      itemFocused = findNested(listProp, (item) => canSelectedItem(item));
    }

    return itemFocused;
  })();
  const [_itemFocusedWithSearch, setItemFocusedWithSearch] = useState<(T & { [IS_CREATED]?: boolean | undefined }) | undefined>();
  const itemFocusedWithSearch = (() => {
    if (_itemFocusedWithSearch && findNested(searchList, (item) => canSelectedItem(item) && item.value === _itemFocusedWithSearch.value)) {
      return _itemFocusedWithSearch;
    }

    if (hasSearch) {
      return findNested(searchList, (item) => canSelectedItem(item));
    }
  })();
  const itemFocused = hasSearch ? itemFocusedWithSearch : itemFocusedWithoutSearch;
  const changeItemFocused = (item: T) => {
    hasSearch ? setItemFocusedWithSearch(item) : setItemFocusedWithoutSearch(item);
  };

  const handleCreateItem = (item?: T) => {
    if (!isUndefined(item)) {
      const newItem = Object.assign({} as any, item);
      delete newItem[IS_CREATED];
      onCreateItem?.(newItem);
    }
  };

  const maxZIndex = useMaxIndex(visible);
  const zIndex = `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  const transformOrigin = useRef<string>();
  const updatePosition = useEventCallback(() => {
    if (visible && boxRef.current && popupRef.current) {
      if (monospaced) {
        const width = Math.min(boxRef.current.offsetWidth, ROOT_DATA.windowSize.width - WINDOW_SPACE * 2);
        const height = popupRef.current.offsetHeight;
        const position = getVerticalSidePosition(
          boxRef.current,
          { width, height },
          {
            placement: 'bottom',
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
          width,
        });
        popupRef.current.classList.toggle(sheet.classes.position, true);
      } else {
        const boxWidth = boxRef.current.offsetWidth;
        const height = popupRef.current.offsetHeight;
        const maxWidth = ROOT_DATA.windowSize.width - WINDOW_SPACE * 2;
        const width = Math.min(Math.max(popupRef.current.scrollWidth, boxWidth), maxWidth);
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
          minWidth: Math.min(boxWidth, maxWidth),
          maxWidth,
        });
        popupRef.current.classList.toggle(sheet.classes.position, true);
      }
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
          ...mergeCS(styled('select__search'), {
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
              const focusItem = (code: 'next' | 'prev' | 'first' | 'last') => {
                if (listRef.current) {
                  let item: T | undefined;
                  switch (code) {
                    case 'next':
                      item = vsRef.current?.scrollToStep(listRef.current, 1);
                      break;

                    case 'prev':
                      item = vsRef.current?.scrollToStep(listRef.current, -1);
                      break;

                    case 'first':
                      item = vsRef.current?.scrollToStart(listRef.current);
                      break;

                    case 'last':
                      item = vsRef.current?.scrollToEnd(listRef.current);
                      break;

                    default:
                      break;
                  }
                  if (item) {
                    changeItemFocused(item);
                    if (virtual === false) {
                      scrollCallback.current = () => {
                        const el = document.getElementById(getItemId((item as T).value));
                        if (el) {
                          scrollIntoViewIfNeeded(el, listRef.current as HTMLUListElement);
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
                      if (itemFocused) {
                        if ((itemFocused as any)[IS_CREATED]) {
                          handleCreateItem(itemFocused);
                        }
                        changeSelectedByClick(itemFocused.value);
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
      const selectedItems = (_selected as V[]).map((value) => {
        const item = itemsMap.get(value);
        return {
          value,
          label: customSelected ? customSelected(value, item) : item ? item.label : String(value),
          item,
        };
      });

      suffixNode = (
        <Dropdown
          list={selectedItems.map<DropdownItem<V>>(({ value, label, item }) => ({
            id: value,
            title: label,
            type: 'item',
            disabled: item?.disabled,
          }))}
          onClick={(id: V) => {
            changeSelectedByClick(id);
            return false;
          }}
        >
          <Tag tabIndex={-1} size={size}>
            {(selected as Set<V>).size}
          </Tag>
        </Dropdown>
      );
      selectedNode = selectedItems.map(({ value, label, item }) => (
        <Tag key={value} size={size}>
          {label}
          {!(item?.disabled || disabled) && (
            <div
              {...styled('select__close')}
              role="button"
              aria-label={t('Close')}
              onClick={(e) => {
                e.stopPropagation();

                changeSelectedByClick(value);
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
        const item = itemsMap.get(selected as V);
        selectedLabel = item ? item.label : String(selected);
        selectedNode = customSelected ? customSelected(selected as V, item) : selectedLabel;
      }
    }
    return [selectedNode, suffixNode, selectedLabel];
  })();

  const designProps = useDesign({ compose: { disabled }, form: formControl });

  const vsProps = useMemo<VirtualScrollOptimization<T>>(
    () => ({
      list,
      itemKey: (item) => item.value,
      itemSize: isNumber(virtual) ? virtual : 32,
      itemEmptySize: 32,
      itemNested: (item) => item.children as T[],
      itemFocusable: canSelectedItem,
    }),
    [canSelectedItem, list, virtual],
  );

  return (
    <>
      <div
        {...restProps}
        {...mergeCS(
          styled('select', `select--${size}`, {
            'select.is-expanded': visible,
            'select.is-disabled': disabled,
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
        <div {...styled('select__container')} title={selectedLabel}>
          {inputRender ? inputRender(inputNode) : inputNode}
          {!inputable &&
            (hasSelected ? (
              <div {...styled('select__content')}>{selectedNode}</div>
            ) : placeholder ? (
              <div {...styled('select__placeholder-wrapper')}>
                <div {...styled('select__placeholder')}>{placeholder}</div>
              </div>
            ) : null)}
        </div>
        {multiple && (
          <div
            {...styled('select__multiple-count')}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {suffixNode}
          </div>
        )}
        {clearable && (
          <div
            {...styled('select__clear')}
            role="button"
            aria-label={t('Clear')}
            onClick={(e) => {
              e.stopPropagation();

              if (multiple) {
                changeSelected([]);
              } else {
                changeSelected(null);
              }
              onClear?.();
            }}
          >
            <Icon>
              <CancelFilled />
            </Icon>
          </div>
        )}
        <div
          {...mergeCS(styled('select__icon'), {
            style: { visibility: clearable ? 'hidden' : undefined },
          })}
        >
          <Icon>
            {loading ? <CircularProgress /> : inputable ? <SearchOutlined /> : <KeyboardArrowDownOutlined {...styled('select__arrow')} />}
          </Icon>
        </div>
      </div>
      <Portal
        selector={() => {
          let el = document.getElementById(`${namespace}-select-root`);
          if (!el) {
            el = document.createElement('div');
            el.id = `${namespace}-select-root`;
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
                {...mergeCS(styled('select-popup'), {
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
                {(() => {
                  const el = (
                    <div {...styled('select-popup__content')}>
                      {loading && (
                        <div
                          {...styled('select-popup__loading', {
                            'select-popup__loading--empty': list.length === 0,
                          })}
                        >
                          <Icon>
                            <CircularProgress />
                          </Icon>
                        </div>
                      )}
                      {loading && list.length === 0 ? null : (
                        <VirtualScroll
                          {...vsProps}
                          ref={vsRef}
                          enable={virtual !== false}
                          listSize={264}
                          listPadding={4}
                          itemRender={(item, index, props, ancestry, children) => {
                            const { label: itemLabel, value: itemValue, disabled: itemDisabled } = item;

                            const node = customItem ? customItem(item) : itemLabel;

                            if (children) {
                              return (
                                <ul {...styled('select__option-group')} key={itemValue} role="group" aria-labelledby={getItemId(itemValue)}>
                                  <li
                                    {...styled('select__option-group-label')}
                                    key={itemValue}
                                    id={getItemId(itemValue)}
                                    role="presentation"
                                  >
                                    <div {...styled('select__option-content')}>{node}</div>
                                  </li>
                                  {children}
                                </ul>
                              );
                            }

                            let isSelected = false;
                            if (multiple) {
                              isSelected = (selected as Set<V>).has(itemValue);
                            } else {
                              isSelected = (selected as V | null) === itemValue;
                            }

                            return (
                              <li
                                {...mergeCS(
                                  styled('select__option', {
                                    'select__option.is-selected': !multiple && isSelected,
                                    'select__option.is-disabled': itemDisabled,
                                  }),
                                  { style: { paddingLeft: ancestry.length === 0 ? undefined : 12 + 8 } },
                                )}
                                {...props}
                                key={itemValue}
                                id={getItemId(itemValue)}
                                title={((item as any)[IS_CREATED] ? t('Create') + ' ' : '') + itemLabel}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={itemDisabled}
                                onClick={() => {
                                  if ((item as any)[IS_CREATED]) {
                                    handleCreateItem(item);
                                  }
                                  changeItemFocused(item);
                                  changeSelectedByClick(itemValue);
                                }}
                              >
                                {focusVisible && itemFocused?.value === itemValue && <div className={`${namespace}-focus-outline`} />}
                                {(item as any)[IS_CREATED] ? (
                                  <div {...styled('select__option-prefix')}>
                                    <Icon theme="primary">
                                      <AddOutlined />
                                    </Icon>
                                  </div>
                                ) : multiple ? (
                                  <div {...styled('select__option-prefix')}>
                                    <Checkbox model={isSelected} disabled={itemDisabled} />
                                  </div>
                                ) : null}
                                <div {...styled('select__option-content')}>{node}</div>
                              </li>
                            );
                          }}
                          itemFocused={itemFocused?.value}
                          itemEmptyRender={() => (
                            <li {...mergeCS(styled('select__empty'), { style: { paddingLeft: 12 + 8 } })}>
                              <div {...styled('select__option-content')}>{t('No Data')}</div>
                            </li>
                          )}
                          itemInAriaSetsize={(item) => !item.children}
                          placeholder="li"
                          onScrollEnd={onScrollBottom}
                        >
                          {(vsList, onScroll) => (
                            <ul
                              {...styled('select__list')}
                              ref={listRef}
                              id={listId}
                              tabIndex={-1}
                              role="listbox"
                              aria-multiselectable={multiple}
                              aria-activedescendant={isUndefined(itemFocused) ? undefined : getItemId(itemFocused.value)}
                              onScroll={onScroll}
                            >
                              {list.length === 0 ? <Empty style={{ padding: '12px 0' }} image={Empty.SIMPLE_IMG} /> : vsList}
                            </ul>
                          )}
                        </VirtualScroll>
                      )}
                    </div>
                  );
                  return popupRender ? popupRender(el) : el;
                })()}
              </div>
            );
          }}
        </Transition>
      </Portal>
    </>
  );
}

export const Select: <V extends React.Key, T extends SelectItem<V>>(
  props: SelectProps<V, T> & React.RefAttributes<SelectRef>,
) => ReturnType<typeof SelectFC> = forwardRef(SelectFC) as any;
