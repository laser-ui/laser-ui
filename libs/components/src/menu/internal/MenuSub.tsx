import type { Styled } from '../../hooks/useStyled';
import type { MenuMode } from '../types';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import { isUndefined } from 'lodash';
import { useImperativeHandle, useRef } from 'react';

import { useMaxIndex, useTranslation } from '../../hooks';
import { Popup } from '../../internal/popup';
import { Portal } from '../../internal/portal';
import { CollapseTransition, Transition } from '../../transition';
import { getHorizontalSidePosition, getVerticalSidePosition, mergeCS } from '../../utils';
import { TTANSITION_DURING_BASE, TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../../vars';

interface MenuSubProps {
  ref: React.RefCallback<() => void>;
  children: React.ReactNode;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  level: number;
  space: number;
  step: number;
  icon: React.ReactNode | undefined;
  list: React.ReactNode;
  popupState: boolean | undefined;
  trigger: 'hover' | 'click';
  posinset: [number, number];
  mode: MenuMode;
  inNav: boolean;
  active: boolean;
  includeActive: boolean;
  expand: boolean;
  empty: boolean;
  focus: boolean;
  disabled: boolean;
  onVisibleChange: (visible: boolean) => void;
  onClick: React.MouseEventHandler<HTMLLIElement>;
}

export function MenuSub(props: MenuSubProps): React.ReactElement | null {
  const {
    ref,
    children,
    namespace,
    styled,
    id,
    level,
    space,
    step,
    icon,
    list,
    popupState,
    trigger,
    posinset,
    mode,
    inNav,
    active,
    includeActive,
    expand,
    empty,
    focus,
    disabled,
    onVisibleChange,
    onClick,
  } = props;

  const triggerRef = useRef<HTMLLIElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const nodeSaved = useRef<React.ReactElement>(null);

  const { t } = useTranslation();

  const visible = !isUndefined(popupState);
  const inHorizontalNav = mode === 'horizontal' && inNav;
  const iconMode = mode === 'icon' && inNav;

  const updatePosition = useEventCallback(() => {
    if (!(disabled || mode === 'vertical') && visible && popupRef.current && triggerRef.current) {
      const height = popupRef.current.offsetHeight;

      let width = popupRef.current.offsetWidth;
      if (inHorizontalNav) {
        width = triggerRef.current.offsetWidth - 32;
      }

      const position = inHorizontalNav
        ? getVerticalSidePosition(
            triggerRef.current,
            { width, height },
            {
              placement: 'bottom',
              gap: 12,
              inWindow: WINDOW_SPACE,
            },
          )
        : getHorizontalSidePosition(
            triggerRef.current,
            { width, height },
            {
              placement: 'right',
              gap: inNav ? 10 : 14,
              inWindow: WINDOW_SPACE,
            },
          );
      popupRef.current.style.setProperty(`--popup-down-transform-origin`, position.transformOrigin);
      popupRef.current.style.top = position.top + 'px';
      popupRef.current.style.left = position.left + 'px';
      popupRef.current.style.width = inHorizontalNav ? width + 'px' : '';
    }
  });

  const maxZIndex = useMaxIndex(visible);

  useImperativeHandle(ref, () => updatePosition, [updatePosition]);

  return (
    <>
      <Popup
        visible={popupState ?? false}
        trigger={trigger}
        disabled={disabled || mode === 'vertical'}
        updatePosition={{
          fn: updatePosition,
          triggerRef,
          popupRef,
          scroll: false,
        }}
        onVisibleChange={onVisibleChange}
      >
        {(popupProps) => (
          <>
            <li
              {...mergeCS(
                styled('menu__item', 'menu__item--sub', {
                  'menu__item--horizontal': inHorizontalNav,
                  'menu__item--icon': iconMode,
                  'menu__item.is-active': active,
                  'menu__item.is-expand': mode === 'vertical' ? expand && includeActive : visible,
                  'menu__item.is-disabled': disabled,
                }),
                { style: { paddingLeft: space + level * step } },
              )}
              ref={triggerRef}
              id={id}
              role="menuitem"
              aria-haspopup
              aria-expanded={mode === 'vertical' ? expand : visible}
              aria-disabled={disabled}
              {...popupProps.trigger}
              onClick={(e) => {
                popupProps.trigger.onClick(e);
                onClick(e);
              }}
            >
              {focus && <div className={`${namespace}-focus-outline`} />}
              <div
                {...styled('menu__indicator', {
                  'menu__indicator--first': posinset[0] === 0 && posinset[1] > 1,
                  'menu__indicator--last': posinset[0] === posinset[1] - 1 && posinset[1] > 1,
                })}
              >
                <div {...styled('menu__indicator-track', { 'menu__indicator-track--hidden': level === 0 })} />
                <div {...styled('menu__indicator-thumb')} />
              </div>
              {checkNodeExist(icon) && <div {...styled('menu__item-icon')}>{icon}</div>}
              <div {...styled('menu__item-content')}>{children}</div>
              {!inHorizontalNav && (
                <div
                  {...styled('menu__sub-arrow', {
                    'menu__sub-arrow--horizontal': mode !== 'vertical' && !inHorizontalNav,
                    'menu__sub-arrow.is-expand': mode === 'vertical' && expand,
                  })}
                  aria-hidden
                >
                  <div />
                  <div />
                </div>
              )}
            </li>
            {mode !== 'vertical' && (
              <Portal
                selector={() => {
                  let el = document.getElementById(`${namespace}-menu-root`);
                  if (!el) {
                    el = document.createElement('div');
                    el.id = `${namespace}-menu-root`;
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
                >
                  {(transitionRef, leaved) => (
                    <div
                      {...mergeCS(styled('menu-popup'), {
                        style: {
                          zIndex: `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`,
                          ...(inHorizontalNav ? undefined : { minWidth: 160 }),
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
                      <ul {...styled('menu__sub-list')} role="menu" aria-labelledby={id}>
                        {empty ? (
                          <div {...mergeCS(styled('menu__empty'), { style: { paddingLeft: space + level * step } })}>{t('No data')}</div>
                        ) : (
                          list
                        )}
                      </ul>
                    </div>
                  )}
                </Transition>
              </Portal>
            )}
          </>
        )}
      </Popup>
      <CollapseTransition height={0} enter={mode === 'vertical' ? expand : false} duration={TTANSITION_DURING_BASE}>
        {(transitionRef, leaved) => {
          if (mode !== 'vertical') {
            if (inNav && !leaved && nodeSaved.current) {
              return nodeSaved.current;
            }
            return null;
          }

          const node = (
            <ul
              {...mergeCS(styled('menu__sub-list'), {
                style: { ...(leaved ? { display: 'none' } : undefined) },
              })}
              ref={mode === 'vertical' || inNav ? transitionRef : undefined}
              role="menu"
              aria-labelledby={id}
            >
              {empty ? (
                <div {...mergeCS(styled('menu__empty'), { style: { paddingLeft: space + (level + 1) * step } })}>{t('No data')}</div>
              ) : (
                list
              )}
            </ul>
          );
          if (mode === 'vertical' && inNav) {
            nodeSaved.current = node;
          }
          return node;
        }}
      </CollapseTransition>
    </>
  );
}
