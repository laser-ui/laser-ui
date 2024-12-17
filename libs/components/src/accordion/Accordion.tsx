import type { AccordionItem, AccordionProps } from './types';

import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import { isNull, isUndefined, nth } from 'lodash';
import { useId } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useNamespace, useStyled } from '../hooks';
import { Icon } from '../icon';
import { LazyLoading } from '../internal/lazy-loading';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Accordion<ID extends React.Key, T extends AccordionItem<ID>>(props: AccordionProps<ID, T>): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    active: activeProp,
    defaultActive,
    activeOne,
    arrow = 'right',
    lazyLoading = true,
    onActiveChange,
    afterActiveChange,

    ...restProps
  } = useComponentProps('Accordion', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { accordion: styleProvider?.accordion }, styleOverrides);

  const uniqueId = useId();
  const getButtonId = (id: ID) => `${namespace}-accordion-button-${id}-${uniqueId}`;
  const getRegionId = (id: ID) => `${namespace}-accordion-region-${id}-${uniqueId}`;

  const [activeId, changeActiveId] = useControlled<ID | null | ID[]>(defaultActive ?? (activeOne ? null : []), activeProp, (id) => {
    if (onActiveChange) {
      if (activeOne) {
        onActiveChange(id, isNull(id) ? null : list.find((item) => item.id === id));
      } else {
        let length = (id as ID[]).length;
        const items: T[] = [];
        for (const item of list) {
          if (length === 0) {
            break;
          }

          const index = (id as ID[]).findIndex((v) => v === item.id);
          if (index !== -1) {
            items[index] = item;
            length -= 1;
          }
        }

        onActiveChange(id, items);
      }
    }
  });

  return (
    <div
      {...restProps}
      {...mergeCS(styled('accordion'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {list.map((item, index) => {
        const { id: itemId, title: itemTitle, region: itemRegion, arrow: itemArrow = arrow, disabled: itemDisabled = false } = item;

        const getAccordion = (next: boolean, _index = index): T | undefined => {
          for (let focusIndex = next ? _index + 1 : _index - 1, n = 0; n < list.length; next ? focusIndex++ : focusIndex--, n++) {
            const t = nth(list, focusIndex % list.length);
            if (t && !t.disabled) {
              return t;
            }
          }
        };

        const focusTab = (t?: T) => {
          if (t) {
            const el = document.getElementById(getButtonId(t.id));
            if (el) {
              el.focus();
            }
          }
        };

        const buttonId = getButtonId(itemId);
        const regionId = getRegionId(itemId);
        const isActive = activeOne ? activeId === itemId : (activeId as ID[]).includes(itemId);
        const iconRotate = (() => {
          if (itemArrow === 'left' && !isActive) {
            return -90;
          }
          if (itemArrow === 'right' && isActive) {
            return 180;
          }
          return undefined;
        })();

        const handleClick = () => {
          if (activeOne) {
            changeActiveId(isActive ? null : itemId);
          } else {
            changeActiveId((draft) => {
              const index = (draft as ID[]).findIndex((v) => v === itemId);
              if (index !== -1) {
                (draft as ID[]).splice(index, 1);
              } else {
                (draft as ID[]).push(itemId);
              }
            });
          }
        };

        return (
          <div {...styled('accordion__item')} key={itemId}>
            <div
              {...styled('accordion__item-button', {
                'accordion__item-button.is-disabled': itemDisabled,
                'accordion__item-button--arrow-left': itemArrow === 'left',
              })}
              id={buttonId}
              tabIndex={itemDisabled ? -1 : 0}
              role="button"
              aria-controls={regionId}
              aria-expanded={isActive}
              aria-disabled={itemDisabled}
              onClick={handleClick}
              onKeyDown={(e) => {
                switch (e.code) {
                  case 'Enter':
                  case 'Space':
                    e.preventDefault();
                    handleClick();
                    break;

                  case 'ArrowUp':
                    e.preventDefault();
                    focusTab(getAccordion(false));
                    break;

                  case 'ArrowDown':
                    e.preventDefault();
                    focusTab(getAccordion(true));
                    break;

                  case 'Home':
                    e.preventDefault();
                    for (const a of list) {
                      if (!a.disabled) {
                        focusTab(a);
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
              <div {...styled('accordion__item-title')}>{itemTitle}</div>
              {itemArrow && (
                <div
                  {...mergeCS(styled('accordion__item-arrow'), {
                    style: {
                      transform: isUndefined(iconRotate) ? undefined : `rotate(${iconRotate}deg)`,
                    },
                  })}
                >
                  <Icon>
                    <KeyboardArrowDownOutlined />
                  </Icon>
                </div>
              )}
            </div>
            <CollapseTransition
              height={0}
              enter={isActive}
              name={`${namespace}-accordion`}
              duration={TTANSITION_DURING_BASE}
              onAfterEnter={() => {
                afterActiveChange?.(itemId, item, true);
              }}
              onAfterLeave={() => {
                afterActiveChange?.(itemId, item, false);
              }}
            >
              {(transitionRef, leaved) => (
                <LazyLoading hidden={leaved} disabled={!lazyLoading}>
                  <div
                    ref={(instance) => {
                      transitionRef(instance);
                      return () => {
                        transitionRef(null);
                      };
                    }}
                  >
                    <div
                      {...mergeCS(styled('accordion__item-region'), {
                        style: { ...(leaved ? { display: 'none' } : undefined) },
                      })}
                      id={regionId}
                      role="region"
                      aria-labelledby={getButtonId(itemId)}
                    >
                      {itemRegion}
                    </div>
                  </div>
                </LazyLoading>
              )}
            </CollapseTransition>
          </div>
        );
      })}
    </div>
  );
}
