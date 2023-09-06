import type { TabsItem, TabsProps, TabsRef } from './types';
import type { DropdownItem } from '../dropdown/types';

import { useEventCallback, useIsomorphicLayoutEffect, useResize } from '@laser-ui/hooks';
import { checkScrollEnd, findNested } from '@laser-ui/utils';
import { ReactComponent as AddOutlined } from '@material-design-icons/svg/outlined/add.svg';
import { ReactComponent as CloseOutlined } from '@material-design-icons/svg/outlined/close.svg';
import { ReactComponent as MoreHorizOutlined } from '@material-design-icons/svg/outlined/more_horiz.svg';
import { isUndefined, nth } from 'lodash';
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';

import { CLASSES } from './vars';
import { Dropdown } from '../dropdown';
import { useComponentProps, useControlled, useNamespace, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

function TabsFC<ID extends React.Key, T extends TabsItem<ID>>(
  props: TabsProps<ID, T>,
  ref: React.ForwardedRef<TabsRef>,
): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    active: activeProp,
    defaultActive,
    pattern,
    placement = 'top',
    center = false,
    size = 'medium',
    addible = false,
    onActiveChange,
    onAddClick,
    onClose,

    ...restProps
  } = useComponentProps('Tabs', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { tabs: styleProvider?.tabs }, styleOverrides);

  const { t } = useTranslation();

  const uniqueId = useId();
  const getTabId = (id: ID) => `${namespace}-tabs-tab-${id}-${uniqueId}`;
  const getPanelId = (id: ID) => `${namespace}-tabs-panel-${id}-${uniqueId}`;

  const tabsRef = useRef<HTMLDivElement>(null);
  const tablistWrapperRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const [listOverflow, setListOverflow] = useState(false);
  const [dropdownList, setDropdownList] = useState<T[]>([]);
  const [scrollEnd, setScrollEnd] = useState(false);

  const iconSize = size === 'small' ? 16 : size === 'large' ? 20 : 18;
  const isHorizontal = placement === 'top' || placement === 'bottom';

  const [active, changeActive] = useControlled<ID | null, ID>(
    defaultActive ??
      (() => {
        for (const tab of list) {
          if (!tab.disabled) {
            return tab.id;
          }
        }
        return null;
      }),
    activeProp,
    (id) => {
      if (onActiveChange) {
        onActiveChange(id, findNested(list, (item) => item.id === id) as T);
      }
    },
  );

  const refreshTabs = () => {
    const tablistWrapperEl = tablistWrapperRef.current;
    if (tablistWrapperEl) {
      const isOverflow = isHorizontal
        ? tablistWrapperEl.scrollWidth > tablistWrapperEl.clientWidth
        : tablistWrapperEl.scrollHeight > tablistWrapperEl.clientHeight;
      setListOverflow(isOverflow);
      setScrollEnd(checkScrollEnd(tablistWrapperEl)[isHorizontal ? 'x' : 'y']);

      if (isOverflow) {
        const tablistWrapperRect = tablistWrapperEl.getBoundingClientRect();
        const dropdownList: T[] = [];
        list.forEach((tab) => {
          const el = document.getElementById(getTabId(tab.id));
          if (el) {
            const rect = el.getBoundingClientRect();
            if (isHorizontal) {
              if (
                rect.right + (buttonContainerRef.current?.offsetWidth ?? 0) > tablistWrapperRect.right ||
                rect.left < tablistWrapperRect.left
              ) {
                dropdownList.push(tab);
              }
            } else {
              if (
                rect.bottom + (buttonContainerRef.current?.offsetHeight ?? 0) > tablistWrapperRect.bottom ||
                rect.top < tablistWrapperRect.top
              ) {
                dropdownList.push(tab);
              }
            }
          }
        });

        setDropdownList(dropdownList);
      }
    }
  };
  useIsomorphicLayoutEffect(() => {
    refreshTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useResize(tablistWrapperRef, refreshTabs);
  useResize(tablistRef, refreshTabs);

  const updateIndicator = useEventCallback(() => {
    if (tablistRef.current && indicatorRef.current) {
      const tablistRect = tablistRef.current.getBoundingClientRect();
      for (const tab of list) {
        if (tab.id === active) {
          const el = document.getElementById(getTabId(tab.id));
          if (el) {
            const rect = el.getBoundingClientRect();
            if (isHorizontal) {
              indicatorRef.current.style.cssText = `left:${rect.left - tablistRect.left}px;width:${rect.width}px;opacity:1;`;
            } else {
              indicatorRef.current.style.cssText = `top:${rect.top - tablistRect.top}px;opacity:1;`;
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    updateIndicator();
  });

  useImperativeHandle(
    ref,
    () => ({
      updateIndicator,
    }),
    [updateIndicator],
  );

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('tabs', `tabs--${placement}`, `tabs--${size}`, {
          [`tabs--${pattern}`]: pattern,
          'tabs--center': center,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={tabsRef}
    >
      <div
        {...styled('tabs__tablist-wrapper')}
        ref={tablistWrapperRef}
        onScroll={() => {
          refreshTabs();
        }}
      >
        <div {...styled('tabs__tablist')} ref={tablistRef} role="tablist" aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}>
          {list.map((item, index) => {
            const { id: itemId, title: itemTitle, disabled: itemDisabled, closable: itemClosable } = item;

            const isActive = itemId === active;

            const getTab = (next: boolean, _index = index): T | undefined => {
              for (let focusIndex = next ? _index + 1 : _index - 1, n = 0; n < list.length; next ? focusIndex++ : focusIndex--, n++) {
                const t = nth(list, focusIndex % list.length);
                if (t && !t.disabled) {
                  return t;
                }
              }
            };

            const focusTab = (t?: T) => {
              if (t) {
                changeActive(t.id);

                const el = document.getElementById(getTabId(t.id));
                if (el) {
                  el.focus();
                }
              }
            };

            const closeTab = () => {
              if (isActive) {
                let hasTab = false;
                for (let focusIndex = index + 1; focusIndex < list.length; focusIndex++) {
                  const t = nth(list, focusIndex);
                  if (t && !t.disabled) {
                    hasTab = true;
                    focusTab(t);
                    break;
                  }
                }
                if (!hasTab) {
                  for (let focusIndex = index - 1; focusIndex >= 0; focusIndex--) {
                    const t = nth(list, focusIndex);
                    if (t && !t.disabled) {
                      focusTab(t);
                      break;
                    }
                  }
                }
              }
              onClose?.(itemId, item);
            };

            return (
              <div
                {...styled('tabs__tab', {
                  'tabs__tab.is-active': isActive,
                  'tabs__tab.is-disabled': itemDisabled,
                  'tabs__tab--first': index === 0,
                  'tabs__tab--last': index === list.length - 1,
                })}
                key={itemId}
                id={getTabId(itemId)}
                tabIndex={isActive && !itemDisabled ? 0 : -1}
                role="tab"
                aria-controls={getPanelId(itemId)}
                aria-selected={isActive}
                aria-disabled={itemDisabled}
                onClick={() => {
                  changeActive(itemId);
                }}
                onKeyDown={(e) => {
                  switch (e.code) {
                    case 'Delete':
                      e.preventDefault();
                      if (itemClosable) {
                        closeTab();
                      }
                      break;

                    case 'ArrowLeft':
                      e.preventDefault();
                      if (placement === 'top' || placement === 'bottom') {
                        focusTab(getTab(false));
                      }
                      break;

                    case 'ArrowRight':
                      e.preventDefault();
                      if (placement === 'top' || placement === 'bottom') {
                        focusTab(getTab(true));
                      }
                      break;

                    case 'ArrowUp':
                      e.preventDefault();
                      if (placement === 'left' || placement === 'right') {
                        focusTab(getTab(false));
                      }
                      break;

                    case 'ArrowDown':
                      e.preventDefault();
                      if (placement === 'left' || placement === 'right') {
                        focusTab(getTab(true));
                      }
                      break;

                    case 'Home':
                      e.preventDefault();
                      for (const t of list) {
                        if (!t.disabled) {
                          focusTab(t);
                          break;
                        }
                      }
                      break;

                    case 'End':
                      e.preventDefault();
                      for (let index = list.length - 1; index >= 0; index--) {
                        if (!list[index].disabled) {
                          focusTab(list[index]);
                          break;
                        }
                      }
                      break;

                    default:
                      break;
                  }
                }}
              >
                {itemTitle}
                {!itemDisabled && itemClosable && (
                  <div
                    {...styled('tabs__close')}
                    role="button"
                    aria-label={t('Close')}
                    onClick={(e) => {
                      e.stopPropagation();

                      closeTab();
                    }}
                  >
                    <Icon>
                      <CloseOutlined />
                    </Icon>
                  </div>
                )}
              </div>
            );
          })}
          {(listOverflow || addible) && (
            <div {...styled('tabs__button-container')} ref={buttonContainerRef}>
              {listOverflow && (
                <Dropdown
                  list={dropdownList.map<DropdownItem<ID>>((tab) => {
                    const { id: itemId, title: itemTitle, dropdownRender: itemDropdownRender, disabled: itemDisabled } = tab;

                    return {
                      id: itemId,
                      title: isUndefined(itemDropdownRender) ? itemTitle : itemDropdownRender,
                      type: 'item',
                      disabled: itemDisabled,
                      style: itemId === active ? { color: `var(--${namespace}-color-primary)` } : undefined,
                    };
                  })}
                  placement={placement === 'left' ? 'bottom-left' : 'bottom-right'}
                  onClick={(id: ID) => {
                    changeActive(id);
                  }}
                >
                  <div
                    {...styled('tabs__button', 'tabs__button--more', {
                      'tabs__button.is-end': scrollEnd,
                    })}
                    aria-label={t('More')}
                  >
                    <Icon size={iconSize}>
                      <MoreHorizOutlined />
                    </Icon>
                  </div>
                </Dropdown>
              )}
              {addible && (
                <div
                  {...styled('tabs__button', 'tabs__button--add')}
                  role="button"
                  aria-label={t('Add')}
                  onClick={() => {
                    onAddClick?.();
                  }}
                >
                  <Icon size={iconSize}>
                    <AddOutlined />
                  </Icon>
                </div>
              )}
            </div>
          )}
          <div
            {...styled(pattern === 'wrap' ? 'tabs__wrap-indicator' : pattern === 'slider' ? 'tabs__slider-indicator' : 'tabs__indicator')}
            ref={indicatorRef}
          />
        </div>
      </div>
      {list.map((item) => {
        const { id: itemId, panel: itemPanel } = item;

        return (
          <div
            {...styled('tabs__tabpanel')}
            key={itemId}
            id={getPanelId(itemId)}
            tabIndex={0}
            hidden={itemId !== active}
            role="tabpanel"
            aria-labelledby={getTabId(itemId)}
          >
            {itemPanel}
          </div>
        );
      })}
    </div>
  );
}

export const Tabs: <ID extends React.Key, T extends TabsItem<ID>>(
  props: TabsProps<ID, T> & React.RefAttributes<TabsRef>,
) => ReturnType<typeof TabsFC> = forwardRef(TabsFC) as any;
