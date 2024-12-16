import type { MenuItem, MenuProps } from './types';

import { findNested } from '@laser-ui/utils';
import { isNull, isUndefined, nth } from 'lodash';
import { Fragment, useCallback, useId, useImperativeHandle, useRef, useState } from 'react';

import { MenuGroup } from './internal/MenuGroup';
import { MenuItem as MenuItemFC } from './internal/MenuItem';
import { MenuSub } from './internal/MenuSub';
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
} from '../hooks';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Menu<ID extends React.Key, T extends MenuItem<ID>>(props: MenuProps<ID, T>): React.ReactElement | null {
  const {
    ref,
    styleOverrides,
    styleProvider,
    list,
    mode = 'vertical',
    width = 'auto',
    active: activeProp,
    defaultActive,
    expands: expandsProp,
    defaultExpands,
    expandOne = false,
    expandTrigger,
    escClosable = true,
    onActiveChange,
    onExpandsChange,

    ...restProps
  } = useComponentProps('Menu', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { menu: styleProvider?.menu, 'menu-popup': styleProvider?.['menu-popup'] }, styleOverrides);

  const uniqueId = useId();
  const getItemId = (id: ID) => `${namespace}-menu-item-${id}-${uniqueId}`;

  const menuRef = useRef<HTMLElement>(null);

  const mousedown = useRef(false);
  const updateSubPosition = useRef(new Set<() => void>());

  const [focusVisible, focusVisibleProps] = useFocusVisible(
    (code) => code.startsWith('Arrow') || ['Home', 'End', 'Enter', 'Space'].includes(code),
  );

  const [active, changeActive] = useControlled<ID | null, ID>(defaultActive ?? null, activeProp, (id) => {
    if (onActiveChange) {
      onActiveChange(id, findNested(list, (item) => item.id === id) as T);
    }
  });
  const actives = (() => {
    let ids: ID[] | undefined;
    const reduceArr = (arr: T[], subParent: ID[] = []) => {
      for (const item of arr) {
        if (ids) {
          break;
        }
        if (item.children) {
          reduceArr(item.children as T[], item.type === 'sub' ? subParent.concat([item.id]) : subParent);
        } else if (item.id === active) {
          ids = subParent.concat([item.id]);
        }
      }
    };
    if (!isNull(active)) {
      reduceArr(list);
    }

    return ids ?? [];
  })();

  const [expands, changeExpands] = useControlled<ID[]>(defaultExpands ?? [], expandsProp, (ids) => {
    if (onExpandsChange) {
      let length = ids.length;
      const items: T[] = [];
      const reduceArr = (arr: T[]) => {
        for (const item of arr) {
          if (length === 0) {
            break;
          }

          if (item.children) {
            reduceArr(item.children as T[]);
          } else {
            const index = ids.findIndex((id) => id === item.id);
            if (index !== -1) {
              items[index] = item;
              length -= 1;
            }
          }
        }
      };
      reduceArr(list);

      onExpandsChange(ids, items);
    }
  });
  const { popupIdsRef, setPopupIds, addPopupId, removePopupId } = useNestedPopup<ID>();
  const popupIds = popupIdsRef.current;
  const [focusIds, setFocusIds] = useState<ID[]>([]);
  const focusId = (() => {
    if (mode === 'vertical') {
      return nth(focusIds, -1);
    } else {
      let id: ID | undefined;
      for (const [index, focusId] of focusIds.entries()) {
        id = focusId;
        if (nth(popupIds, index)?.id !== focusId) {
          break;
        }
      }
      return id;
    }
  })();

  const initFocus = () => {
    let firstId: ID | undefined;
    const ids: ID[] = [];
    const reduceArr = (arr: T[]) => {
      for (const item of arr) {
        if (ids.length === 1) {
          break;
        }

        if ((item.type === 'group' || (mode === 'vertical' && item.type === 'sub' && expands.includes(item.id))) && item.children) {
          reduceArr(item.children as T[]);
        } else if (checkEnableItem(item)) {
          if (isUndefined(firstId)) {
            firstId = item.id;
          }
          if (actives.includes(item.id)) {
            ids.push(item.id);
          }
        }
      }
    };
    reduceArr(list);
    setFocusIds(ids.length === 0 ? (isUndefined(firstId) ? [] : [firstId]) : ids);
  };

  let handleKeyDown: React.KeyboardEventHandler<HTMLElement> | undefined;
  const nodes = (() => {
    const getNodes = (arr: T[], level: number, subParents: T[], inNav = false): React.ReactElement[] => {
      const posinset = new Map<ID, [number, number]>();
      let noGroup: T[] = [];
      for (const item of arr) {
        if (item.type === 'group') {
          for (const [i, o] of noGroup.entries()) {
            posinset.set(o.id, [i, noGroup.length]);
          }
          noGroup = [];
        } else {
          noGroup.push(item);
        }
      }
      for (const [i, o] of noGroup.entries()) {
        posinset.set(o.id, [i, noGroup.length]);
      }

      return arr.map((item) => {
        const { id: itemId, title: itemTitle, type: itemType, icon: itemIcon, disabled: itemDisabled = false, children } = item;

        const nextSubParents = itemType === 'sub' ? subParents.concat([item]) : subParents;
        const id = getItemId(itemId);
        const isExpand = expands.includes(itemId);
        const isFocus = itemId === focusId;
        const isEmpty = !(children && children.length > 0);
        const popupState = popupIds.find((v) => v.id === itemId);

        let step = 20;
        let space = 16;
        if (mode === 'horizontal' && inNav) {
          space = 20;
        }
        if (mode !== 'vertical' && !inNav) {
          step = 12;
          space = 10;
        }

        const handleItemClick = () => {
          changeActive(itemId);
          setFocusIds(subParents.map((parentItem) => parentItem.id).concat([itemId]));
        };

        const handleSubExpand = (sameLevelItems: T[]) => {
          if (isExpand) {
            changeExpands((draft) => {
              const index = draft.findIndex((id) => id === itemId);
              draft.splice(index, 1);
            });
          } else {
            if (expandOne) {
              const ids = expands.filter((id) => sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === id) === -1);
              ids.push(itemId);
              changeExpands(ids);
            } else {
              changeExpands((draft) => {
                draft.push(itemId);
              });
            }
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
            const handleOpenSub = () => {
              if (mode === 'vertical') {
                if (!isExpand) {
                  handleSubExpand(sameLevelItems);
                }
              } else {
                addPopupId(itemId);
              }
              if (children) {
                const newFocusItem = nth(getSameLevelEnableItems(children), 0);
                if (newFocusItem) {
                  setFocusIds(nextSubParents.map((parentItem) => parentItem.id).concat([newFocusItem.id]));
                }
              }
            };

            let code = e.code;
            if (mode === 'horizontal' && inNav) {
              switch (e.code) {
                case 'ArrowUp':
                  code = 'ArrowLeft';
                  break;

                case 'ArrowLeft':
                  code = 'ArrowUp';
                  break;

                case 'ArrowDown':
                  code = 'ArrowRight';
                  break;

                case 'ArrowRight':
                  code = 'ArrowDown';
                  break;

                default:
                  break;
              }
            }

            switch (code) {
              case 'ArrowUp': {
                e.preventDefault();
                const index = sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === itemId);
                const newFocusItem = nth(sameLevelItems, index - 1);
                focusItem(newFocusItem);
                if (mode !== 'vertical' && newFocusItem && nth(popupIds, -1)?.id === itemId) {
                  setPopupIds(popupIds.slice(0, -1));
                }
                break;
              }

              case 'ArrowDown': {
                e.preventDefault();
                const index = sameLevelItems.findIndex((sameLevelItem) => sameLevelItem.id === itemId);
                const newFocusItem = nth(sameLevelItems, (index + 1) % sameLevelItems.length);
                focusItem(newFocusItem);
                if (mode !== 'vertical' && newFocusItem && nth(popupIds, -1)?.id === itemId) {
                  setPopupIds(popupIds.slice(0, -1));
                }
                break;
              }

              case 'ArrowLeft': {
                e.preventDefault();
                if (mode === 'vertical') {
                  changeExpands((draft) => {
                    const index = draft.findIndex((id) => id === nth(subParents, -1)?.id);
                    draft.splice(index, 1);
                  });
                } else {
                  setPopupIds(popupIds.slice(0, -1));
                }
                const ids = subParents.map((item) => item.id);
                if (ids.length > 0) {
                  setFocusIds(ids);
                }
                break;
              }

              case 'ArrowRight':
                e.preventDefault();
                if (itemType === 'sub') {
                  handleOpenSub();
                }
                break;

              case 'Home':
                e.preventDefault();
                focusItem(nth(sameLevelItems, 0));
                break;

              case 'End':
                e.preventDefault();
                focusItem(nth(sameLevelItems, -1));
                break;

              case 'Enter':
              case 'Space':
                e.preventDefault();
                if (itemType === 'item') {
                  handleItemClick();
                } else if (itemType === 'sub') {
                  handleOpenSub();
                }
                break;

              default:
                break;
            }
          };
        }

        return (
          <Fragment key={itemId}>
            {itemType === 'item' ? (
              <MenuItemFC
                namespace={namespace}
                styled={styled}
                id={id}
                level={level}
                space={space}
                step={step}
                icon={itemIcon}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                posinset={posinset.get(itemId)!}
                mode={mode}
                inNav={inNav}
                active={active === itemId}
                focus={focusVisible && isFocus}
                disabled={itemDisabled}
                onClick={handleItemClick}
              >
                {itemTitle}
              </MenuItemFC>
            ) : itemType === 'group' ? (
              <MenuGroup
                styled={styled}
                id={id}
                level={level}
                space={space}
                step={step}
                list={children && getNodes(children as T[], level + 1, nextSubParents)}
                empty={isEmpty}
              >
                {itemTitle}
              </MenuGroup>
            ) : (
              <MenuSub
                ref={(instance) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const fn = instance!;
                  updateSubPosition.current.add(fn);
                  return () => {
                    updateSubPosition.current.delete(fn);
                  };
                }}
                namespace={namespace}
                styled={styled}
                id={id}
                level={level}
                space={space}
                step={step}
                icon={itemIcon}
                list={children && getNodes(children as T[], mode === 'vertical' ? level + 1 : 0, nextSubParents)}
                popupState={popupState?.visible}
                trigger={expandTrigger ?? (mode === 'vertical' ? 'click' : 'hover')}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                posinset={posinset.get(itemId)!}
                mode={mode}
                inNav={inNav}
                active={(mode === 'vertical' ? !isExpand : isUndefined(popupState)) && actives.includes(itemId)}
                includeActive={actives.includes(itemId)}
                expand={isExpand}
                empty={isEmpty}
                focus={focusVisible && isFocus}
                disabled={itemDisabled}
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
                onClick={() => {
                  if (!itemDisabled) {
                    setFocusIds(subParents.map((parentItem) => parentItem.id).concat([itemId]));

                    if (mode === 'vertical') {
                      const sameLevelItems = getSameLevelEnableItems((nth(subParents, -1)?.children as T[]) ?? list);
                      handleSubExpand(sameLevelItems);
                    }
                  }
                }}
              >
                {itemTitle}
              </MenuSub>
            )}
          </Fragment>
        );
      });
    };

    return getNodes(list, 0, [], true);
  })();

  const updatePosition = useCallback(() => {
    for (const fn of updateSubPosition.current) {
      fn();
    }
  }, []);

  useContainerScrolling(menuRef, updatePosition);

  useImperativeHandle(ref, () => ({ updatePosition }), [updatePosition]);

  return (
    <CollapseTransition width={64} enter={mode !== 'icon'} duration={TTANSITION_DURING_BASE}>
      {(transitionRef, leaved) => {
        const preventBlur: React.MouseEventHandler<HTMLElement> = (e) => {
          if (document.activeElement === e.currentTarget && e.button === 0) {
            e.preventDefault();
          }
        };

        return (
          // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
          <nav
            {...restProps}
            {...mergeCS(styled('menu', { 'menu--horizontal': mode === 'horizontal' }), {
              className: restProps.className,
              style: {
                ...restProps.style,
                width,
                ...(leaved ? { display: 'none' } : undefined),
              },
            })}
            ref={(instance) => {
              menuRef.current = instance;
              transitionRef(instance);
              return () => {
                menuRef.current = null;
                transitionRef(null);
              };
            }}
            tabIndex={restProps.tabIndex ?? 0}
            role="menubar"
            aria-orientation={mode === 'horizontal' ? 'horizontal' : 'vertical'}
            aria-activedescendant={isUndefined(focusId) ? undefined : getItemId(focusId)}
            {...focusVisibleProps}
            onFocus={(e) => {
              restProps.onFocus?.(e);
              focusVisibleProps.onFocus(e);

              if (!mousedown.current) {
                initFocus();
              }
              mousedown.current = false;
            }}
            onBlur={(e) => {
              restProps.onBlur?.(e);
              focusVisibleProps.onBlur(e);

              setPopupIds([]);
            }}
            onKeyDown={(e) => {
              restProps.onKeyDown?.(e);
              focusVisibleProps.onKeyDown(e);

              if (popupIds.length > 0 && escClosable && e.code === 'Escape') {
                e.stopPropagation();
                e.preventDefault();
                setPopupIds([]);
              } else {
                handleKeyDown?.(e);
              }
            }}
            onMouseDown={(e) => {
              restProps.onMouseDown?.(e);

              mousedown.current = true;
              preventBlur(e);
            }}
            onMouseUp={(e) => {
              restProps.onMouseUp?.(e);

              preventBlur(e);
            }}
          >
            {nodes}
          </nav>
        );
      }}
    </CollapseTransition>
  );
}
