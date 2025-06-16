import type { DropdownItem, DropdownProps } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { scrollIntoViewIfNeeded } from '@laser-ui/utils';
import { isNumber, isUndefined, nth } from 'lodash';
import { Fragment, useId, useImperativeHandle, useRef, useState } from 'react';

import { DropdownGroup } from './internal/DropdownGroup';
import { DropdownItem as DropdownItemFC } from './internal/DropdownItem';
import { DropdownSub } from './internal/DropdownSub';
import { checkEnableItem, getSameLevelEnableItems } from './utils';
import { CLASSES } from './vars';
import {
  useComponentProps,
  useContainerScrolling,
  useControlled,
  useFocusVisible,
  useNamespace,
  useNestedPopup,
  useStyled,
  useTranslation,
  useZIndex,
} from '../hooks';
import { Popup } from '../internal/popup';
import { Portal } from '../internal/portal';
import { Separator } from '../separator';
import { Transition } from '../transition';
import { getVerticalSidePosition, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';

export function Dropdown<ID extends React.Key, T extends DropdownItem<ID>>(props: DropdownProps<ID, T>): React.ReactElement | null {
  const {
    ref,
    children,
    styleOverrides,
    styleProvider,
    list,
    visible: visibleProp,
    defaultVisible,
    trigger = 'hover',
    placement: placementProp = 'bottom-right',
    placementFixed = false,
    arrow = false,
    escClosable = true,
    zIndex: zIndexProp,
    popupRender,
    onVisibleChange,
    afterVisibleChange,
    onClick,

    ...restProps
  } = useComponentProps('Dropdown', props);

  const namespace = useNamespace();
  const { t } = useTranslation();
  const styled = useStyled(
    CLASSES,
    { dropdown: styleProvider?.dropdown, 'dropdown-popup': styleProvider?.['dropdown-popup'] },
    styleOverrides,
  );

  const uniqueId = useId();
  const id = restProps.id ?? `${namespace}-dropdown-${uniqueId}`;
  const triggerId = `${namespace}-dropdown-trigger-${uniqueId}`;
  const getItemId = (id: ID) => `${namespace}-dropdown-item-${id}-${uniqueId}`;

  const triggerRef = useRefExtra(() => document.getElementById(triggerId));
  const popupRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateSubPosition = useRef(new Map<ID, () => void>());

  const [focusVisible, focusVisibleProps] = useFocusVisible(
    (code) => code.startsWith('Arrow') || ['Home', 'End', 'Enter', 'Space'].includes(code),
  );

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);
  const { popupIdsRef, setPopupIds, addPopupId, removePopupId } = useNestedPopup<ID>();
  if (!visible) {
    popupIdsRef.current = [];
  }
  const popupIds = popupIdsRef.current;
  const [focusIds, setFocusIds] = useState<ID[]>([]);
  const focusId = (() => {
    let id: ID | undefined;
    for (const [index, focusId] of focusIds.entries()) {
      id = focusId;
      if (nth(popupIds, index)?.id !== focusId) {
        break;
      }
    }
    return id;
  })();
  const focusFirst = () => {
    const ids: ID[] = [];
    const reduceArr = (arr: T[]) => {
      for (const item of arr) {
        if (ids.length === 1) {
          break;
        }

        if (item.type === 'group' && item.children) {
          reduceArr(item.children as T[]);
        } else if (checkEnableItem(item)) {
          ids.push(item.id);
        }
      }
    };
    reduceArr(list);
    setFocusIds(ids);
  };
  const focusLast = () => {
    const ids: ID[] = [];
    const reduceArr = (arr: T[]) => {
      for (let index = arr.length - 1; index >= 0; index--) {
        if (ids.length === 1) {
          break;
        }

        const item = arr[index];
        if (item.type === 'group' && item.children) {
          reduceArr(item.children as T[]);
        } else if (checkEnableItem(item)) {
          ids.push(item.id);
        }
      }
    };
    reduceArr(list);
    setFocusIds(ids);
  };

  const zIndexValue = useZIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${zIndexValue})`;

  const placement = useRef(placementProp);
  const updatePosition = useEventCallback(() => {
    if (visible && triggerRef.current && dropdownRef.current && popupRef.current) {
      const [width, height] = [popupRef.current.offsetWidth, popupRef.current.offsetHeight];
      const position = getVerticalSidePosition(
        triggerRef.current,
        { width, height },
        {
          placement: placementProp,
          placementFixed,
          inWindow: WINDOW_SPACE,
        },
      );
      popupRef.current.style.setProperty(`--popup-down-transform-origin`, position.transformOrigin);
      popupRef.current.style.top = position.top + 'px';
      popupRef.current.style.left = position.left + 'px';

      dropdownRef.current.classList.toggle(`${namespace}-dropdown--${placement.current}`, false);
      placement.current = position.placement;
      dropdownRef.current.classList.toggle(`${namespace}-dropdown--${placement.current}`, true);
    }
  });

  const preventBlur: React.MouseEventHandler<HTMLElement> = (e) => {
    if (e.button === 0) {
      e.preventDefault();
    }
  };

  let handleKeyDown: React.KeyboardEventHandler<HTMLElement> | undefined;
  const nodes = (() => {
    const getNodes = (arr: T[], level: number, subParents: T[]): React.ReactElement[] =>
      arr.map((item) => {
        const {
          id: itemId,
          title: itemTitle,
          type: itemType,
          icon: itemIcon,
          disabled: itemDisabled = false,
          separator: itemSeparator,
          children,
        } = item;

        const newSubParents = itemType === 'sub' ? subParents.concat([item]) : subParents;
        const id = getItemId(itemId);
        const isFocus = itemId === focusId;
        const isEmpty = !(children && children.length > 0);
        const popupState = popupIds.find((v) => v.id === itemId);

        const handleItemClick = () => {
          const close = onClick?.(itemId, item);

          setFocusIds(subParents.map((parentItem) => parentItem.id).concat([itemId]));
          if (close !== false) {
            changeVisible(false);
          }
        };

        if (isFocus) {
          handleKeyDown = (e) => {
            const sameLevelItems = getSameLevelEnableItems((nth(subParents, -1)?.children as T[]) ?? list);
            const focusItem = (val?: T) => {
              if (val) {
                setFocusIds(subParents.map((parentItem) => parentItem.id).concat([val.id]));
              }
            };
            const scrollToItem = (val?: T) => {
              if (val) {
                const el = document.getElementById(getItemId(val.id));
                if (el && ulRef.current) {
                  scrollIntoViewIfNeeded(el, ulRef.current);
                }
              }
            };

            switch (e.code) {
              case 'ArrowUp': {
                e.preventDefault();
                const index = sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === itemId);
                const item = nth(sameLevelItems, index - 1);
                focusItem(item);
                scrollToItem(item);
                if (item && nth(popupIds, -1)?.id === itemId) {
                  setPopupIds(popupIds.slice(0, -1));
                }
                break;
              }

              case 'ArrowDown': {
                e.preventDefault();
                const index = sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === itemId);
                const item = nth(sameLevelItems, (index + 1) % sameLevelItems.length);
                focusItem(item);
                scrollToItem(item);
                if (item && nth(popupIds, -1)?.id === itemId) {
                  setPopupIds(popupIds.slice(0, -1));
                }
                break;
              }

              case 'ArrowLeft': {
                e.preventDefault();
                setPopupIds(popupIds.slice(0, -1));
                const ids = subParents.map((item) => item.id);
                if (ids.length > 0) {
                  setFocusIds(ids);
                }
                break;
              }

              case 'ArrowRight':
                e.preventDefault();
                if (itemType === 'sub') {
                  addPopupId(itemId);
                  if (children) {
                    const newFocusItem = nth(getSameLevelEnableItems(children), 0);
                    if (newFocusItem) {
                      setFocusIds(newSubParents.map((parentItem) => parentItem.id).concat([newFocusItem.id]));
                    }
                  }
                }
                break;

              case 'Home':
                e.preventDefault();
                focusItem(nth(sameLevelItems, 0));
                if (ulRef.current) {
                  ulRef.current.scrollTop = 0;
                }
                break;

              case 'End':
                e.preventDefault();
                focusItem(nth(sameLevelItems, -1));
                if (ulRef.current) {
                  ulRef.current.scrollTop = ulRef.current.scrollHeight;
                }
                break;

              case 'Enter':
              case 'Space':
                e.preventDefault();
                if (itemType === 'item') {
                  handleItemClick();
                } else if (itemType === 'sub') {
                  addPopupId(itemId);
                }
                break;

              default:
                break;
            }
          };
        }

        return (
          <Fragment key={itemId}>
            {itemSeparator && <Separator style={{ margin: '2px 0' }} />}
            {itemType === 'item' ? (
              <DropdownItemFC
                namespace={namespace}
                styled={styled}
                id={id}
                level={level}
                icon={itemIcon}
                focus={focusVisible && isFocus}
                disabled={itemDisabled}
                onClick={handleItemClick}
              >
                {itemTitle}
              </DropdownItemFC>
            ) : itemType === 'group' ? (
              <DropdownGroup
                styled={styled}
                id={id}
                level={level}
                list={children && getNodes(children as T[], level + 1, newSubParents)}
                empty={isEmpty}
              >
                {itemTitle}
              </DropdownGroup>
            ) : (
              <DropdownSub
                ref={(instance) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const fn = instance!;
                  updateSubPosition.current.set(itemId, fn);
                  return () => {
                    updateSubPosition.current.delete(itemId);
                  };
                }}
                namespace={namespace}
                styled={styled}
                id={id}
                level={level}
                icon={itemIcon}
                list={children && getNodes(children as T[], 0, newSubParents)}
                popupState={popupState?.visible}
                trigger={trigger}
                empty={isEmpty}
                focus={focusVisible && isFocus}
                disabled={itemDisabled}
                zIndex={
                  isUndefined(zIndex)
                    ? zIndex
                    : isNumber(zIndex)
                      ? zIndex + 1 + subParents.length
                      : `calc(${zIndex} + ${1 + subParents.length})`
                }
                onVisibleChange={(visible) => {
                  if (visible) {
                    if (subParents.length === 0) {
                      setPopupIds([{ id: itemId, visible: true }]);
                    } else {
                      addPopupId(itemId);
                    }
                  } else {
                    removePopupId(itemId);
                  }
                }}
              >
                {itemTitle}
              </DropdownSub>
            )}
          </Fragment>
        );
      });

    return getNodes(list, 0, []);
  })();

  const updateAllPosition = useEventCallback(() => {
    updatePosition();
    for (const { id } of popupIds) {
      updateSubPosition.current.get(id)?.();
    }
  });

  useContainerScrolling(triggerRef, updateAllPosition, !visible);

  useImperativeHandle(ref, () => ({ updatePosition: updateAllPosition }), []);

  return (
    <Popup
      visible={visible}
      trigger={trigger}
      updatePosition={{
        fn: updatePosition,
        triggerRef,
        popupRef,
      }}
      onVisibleChange={changeVisible}
    >
      {(popupProps) => (
        <>
          {children({
            id: triggerId,
            tabIndex: 0,
            'aria-haspopup': 'menu',
            'aria-expanded': visible,
            'aria-controls': id,
            onClick: (e) => {
              popupProps.trigger.onClick(e);
            },
            onMouseEnter: (e) => {
              popupProps.trigger.onMouseEnter(e);
            },
            onMouseLeave: (e) => {
              popupProps.trigger.onMouseLeave(e);
            },
            onFocus: (e) => {
              focusVisibleProps.onFocus(e);

              focusFirst();
            },
            onBlur: (e) => {
              focusVisibleProps.onBlur(e);

              changeVisible(false);
            },
            onKeyDown: (e) => {
              focusVisibleProps.onKeyDown(e);

              if (visible) {
                if (escClosable && e.code === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  changeVisible(false);
                } else {
                  handleKeyDown?.(e);
                }
              } else {
                switch (e.code) {
                  case 'Enter':
                  case 'Space':
                  case 'ArrowDown':
                    e.preventDefault();
                    focusFirst();
                    changeVisible(true);
                    break;

                  case 'ArrowUp':
                    e.preventDefault();
                    focusLast();
                    changeVisible(true);
                    break;

                  default:
                    break;
                }
              }
            },
          })}
          <Portal
            selector={() => {
              let el = document.getElementById(`${namespace}-dropdown-root`);
              if (!el) {
                el = document.createElement('div');
                el.id = `${namespace}-dropdown-root`;
                document.body.appendChild(el);
              }
              return el;
            }}
          >
            <Transition
              enter={visible}
              name={`${namespace}-popup-down`}
              duration={TTANSITION_DURING_POPUP}
              onSkipEnter={updatePosition}
              onBeforeEnter={updatePosition}
              onAfterEnter={() => {
                afterVisibleChange?.(true);
              }}
              onAfterLeave={() => {
                afterVisibleChange?.(false);
              }}
            >
              {(transitionRef, leaved) => (
                <div
                  {...restProps}
                  {...mergeCS(styled('dropdown'), {
                    className: restProps.className,
                    style: {
                      ...restProps.style,
                      ...(leaved ? { display: 'none' } : undefined),
                    },
                  })}
                  ref={(instance) => {
                    dropdownRef.current = instance;
                    return () => {
                      dropdownRef.current = null;
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
                >
                  <div
                    {...mergeCS(styled('dropdown-popup'), {
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
                    {...popupProps.popup}
                  >
                    {(() => {
                      const el = (
                        <ul
                          {...styled('dropdown__list')}
                          ref={(instance) => {
                            ulRef.current = instance;
                            return () => {
                              ulRef.current = null;
                            };
                          }}
                          id={id}
                          tabIndex={-1}
                          role="menu"
                          aria-labelledby={triggerId}
                          aria-activedescendant={isUndefined(focusId) ? undefined : getItemId(focusId)}
                        >
                          {list.length === 0 ? <div {...styled('dropdown__empty')}>{t('No data')}</div> : nodes}
                        </ul>
                      );
                      return popupRender ? popupRender(el) : el;
                    })()}
                    {arrow && <div {...styled('dropdown__arrow')} />}
                  </div>
                </div>
              )}
            </Transition>
          </Portal>
        </>
      )}
    </Popup>
  );
}
