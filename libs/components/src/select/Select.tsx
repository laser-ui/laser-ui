/* eslint-disable @typescript-eslint/no-empty-function */
import type { SelectItem, SelectProps } from './types';
import type { BaseInputProps } from '../base-input';
import type { DropdownItem } from '../dropdown/types';
import type { VirtualScrollOptimization } from '../virtual-scroll/types';

import { useEventCallback, useResize } from '@laser-ui/hooks';
import { findNested, scrollIntoViewIfNeeded, setRef } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { isNull, isNumber, isUndefined } from 'lodash';
import { Fragment, useCallback, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { CLASSES, IS_CREATED } from './vars';
import { BaseInput } from '../base-input';
import { Checkbox } from '../checkbox';
import { CircularProgress } from '../circular-progress';
import { Dropdown } from '../dropdown';
import { Empty } from '../empty';
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
import { getVerticalSidePosition, isPrintableCharacter, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';
import { VirtualScroll, type VirtualScrollRef } from '../virtual-scroll';

export function Select<V extends React.Key, T extends SelectItem<V>>(props: SelectProps<V, T>): React.ReactElement | null {
  const {
    ref,
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
    inputProps,
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

  const { t } = useTranslation();

  const uniqueId = useId();
  const listId = `${namespace}-select-list-${uniqueId}`;
  const getItemId = (val: V) => `${namespace}-select-item-${val}-${uniqueId}`;

  const { contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const [focusVisible, focusVisibleProps] = useFocusVisible(
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

  const zIndexValue = useZIndex(visible);
  const zIndex = `calc(var(--${namespace}-zindex-fixed) + ${zIndexValue})`;

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
        popupRef.current.style.setProperty(`--popup-down-transform-origin`, position.transformOrigin);
        popupRef.current.style.top = position.top + 'px';
        popupRef.current.style.left = position.left + 'px';
        popupRef.current.style.width = width + 'px';
        popupRef.current.style.minWidth = '';
        popupRef.current.style.maxWidth = '';
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
        popupRef.current.style.setProperty(`--popup-down-transform-origin`, position.transformOrigin);
        popupRef.current.style.top = position.top + 'px';
        popupRef.current.style.left = position.left + 'px';
        popupRef.current.style.width = '';
        popupRef.current.style.minWidth = Math.min(boxWidth, maxWidth) + 'px';
        popupRef.current.style.maxWidth = maxWidth + 'px';
      }
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
      const selectedItems = (_selected as V[]).map((value) => {
        const item = itemsMap.get(value);
        return {
          value,
          label: customSelected ? customSelected(value, item) : item ? item.label : String(value),
          item,
        };
      });

      suffixNode = (
        <Dropdown<V, DropdownItem<V>>
          list={selectedItems.map(({ value, label, item }) => ({
            id: value,
            title: label,
            type: 'item',
            disabled: item?.disabled,
          }))}
          virtual={virtual}
          onClick={(id: V) => {
            changeSelectedByClick(id);
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
        selectedNode = selectedLabel = customSelected ? customSelected(selected as V, item) : item ? item.label : String(selected);
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
        <div {...styled('select__container')} title={selectedLabel}>
          {(() => {
            const nodeProps: any = Object.assign(
              {
                ...inputProps,
                ...mergeCS(styled('select__search'), {
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
                              scrollCallback.current = () => {};
                              const el = document.getElementById(getItemId((item as T).value));
                              if (el) {
                                scrollIntoViewIfNeeded(el, listRef.current as HTMLUListElement);
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
              {...mergeCS(styled('select-popup'), {
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
                        ref={(instance) => {
                          vsRef.current = instance;
                          return () => {
                            vsRef.current = null;
                          };
                        }}
                        enable={virtual !== false}
                        listSize={200 + 32 * 2}
                        listPadding={4}
                        itemRender={(item, index, props, ancestry, children) => {
                          const { label: itemLabel, value: itemValue, disabled: itemDisabled } = item;

                          const node = customItem ? customItem(item) : itemLabel;

                          if (children) {
                            const level = (() => {
                              let val = 1;
                              for (let index = ancestry.length - 1; index > -1; index--) {
                                if (ancestry[index].children) {
                                  val += 1;
                                }
                              }
                              return val;
                            })();

                            return (
                              <Fragment key={itemValue}>
                                <li {...styled('select__option-group-label')} id={getItemId(itemValue)} role="presentation">
                                  <div {...styled('select__option-content')}>{node}</div>
                                </li>
                                <ul
                                  {...mergeCS(styled('select__option-group'), { style: { '--level': level } as any })}
                                  role="group"
                                  aria-labelledby={getItemId(itemValue)}
                                >
                                  {children}
                                </ul>
                              </Fragment>
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
                              {...styled('select__option', {
                                'select__option.is-selected': !multiple && isSelected,
                                'select__option.is-disabled': itemDisabled,
                              })}
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
                            <div {...styled('select__option-content')}>{t('No data')}</div>
                          </li>
                        )}
                        itemInAriaSetsize={(item) => !item.children}
                        placeholder="li"
                        onScrollEnd={onScrollBottom}
                      >
                        {(vsList, onScroll) => (
                          <ul
                            {...styled('select__list')}
                            ref={(instance) => {
                              listRef.current = instance;
                              return () => {
                                listRef.current = null;
                              };
                            }}
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
          )}
        </Transition>
      </Portal>
    </>
  );
}
