import type { DropdownItem, DropdownProps } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { isUndefined, nth } from 'lodash';
import { useId, useImperativeHandle, useRef, useState } from 'react';

import { DropdownList } from './internal/DropdownList';
import { checkEnableItem } from './utils';
import { CLASSES } from './vars';
import {
  useComponentProps,
  useContainerScrolling,
  useControlled,
  useFocusVisible,
  useNamespace,
  useNestedPopup,
  useStyled,
  useZIndex,
} from '../hooks';
import { Popup } from '../internal/popup';
import { Portal } from '../internal/portal';
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
    virtual = false,
    escClosable = true,
    zIndex: zIndexProp,
    popupRender,
    onVisibleChange,
    afterVisibleChange,
    onClick,

    ...restProps
  } = useComponentProps('Dropdown', props);

  const namespace = useNamespace();
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

  const handleKeyDown = useRef<React.KeyboardEventHandler<HTMLElement>>(undefined);

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
                  handleKeyDown.current?.(e);
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
                      const node = (
                        <DropdownList
                          namespace={namespace}
                          styled={styled}
                          ulProps={{
                            id,
                            'aria-labelledby': triggerId,
                            'aria-activedescendant': isUndefined(focusId) ? undefined : getItemId(focusId),
                          }}
                          list={list}
                          virtual={virtual}
                          focusVisible={focusVisible}
                          focusId={focusId}
                          popupIds={popupIds}
                          updateSubPosition={updateSubPosition}
                          trigger={trigger}
                          zIndex={zIndex}
                          handleKeyDown={handleKeyDown}
                          getItemId={getItemId}
                          onClick={onClick}
                          onFocusIdsChange={(ids) => {
                            setFocusIds(ids);
                          }}
                          onPopupIdsChange={(ids) => {
                            setPopupIds(ids);
                          }}
                          addPopupId={addPopupId}
                          removePopupId={removePopupId}
                          onVisibleChange={(visible) => {
                            changeVisible(visible);
                          }}
                        />
                      );
                      return popupRender ? popupRender(node) : node;
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
