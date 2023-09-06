import type { Styled } from '../../hooks/useStyled';
import type { MenuMode } from '../types';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import { isUndefined } from 'lodash';
import { cloneElement, forwardRef, isValidElement, useImperativeHandle, useRef, useState } from 'react';

import { useMaxIndex, useTranslation } from '../../hooks';
import { Popup } from '../../internal/popup';
import { Portal } from '../../internal/portal';
import { CollapseTransition, Transition } from '../../internal/transition';
import { getHorizontalSidePosition, getVerticalSidePosition, mergeCS } from '../../utils';
import { TTANSITION_DURING_BASE, TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../../vars';

interface MenuSubProps {
  children: React.ReactNode;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  menuRef: React.RefObject<HTMLElement>;
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

export const MenuSub = forwardRef<() => void, MenuSubProps>((props, ref): JSX.Element | null => {
  const {
    children,
    namespace,
    styled,
    menuRef,
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

  const dataRef = useRef<{
    nodeCache?: React.ReactNode;
  }>({});

  const { t } = useTranslation();

  const visible = !isUndefined(popupState);
  const inHorizontalNav = mode === 'horizontal' && inNav;
  const iconMode = mode === 'icon' && inNav;

  const [popupPositionStyle, setPopupPositionStyle] = useState<React.CSSProperties>({
    top: '-200vh',
    left: '-200vw',
  });
  const [transformOrigin, setTransformOrigin] = useState<string>();
  const updatePosition = useEventCallback(() => {
    if (visible && popupRef.current && triggerRef.current) {
      const height = popupRef.current.offsetHeight;

      let width = popupRef.current.offsetWidth;
      if (inHorizontalNav) {
        width = triggerRef.current.offsetWidth - 32;
      }

      const { top, left, transformOrigin } = inHorizontalNav
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
      setPopupPositionStyle({
        top,
        left,
        width: inHorizontalNav ? width : undefined,
      });
      setTransformOrigin(transformOrigin);
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
          containerRefs: [],
        }}
        onVisibleChange={onVisibleChange}
      >
        {({ renderTrigger, renderPopup }) => (
          <>
            {renderTrigger(
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
                onClick={(e) => {
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
              </li>,
            )}
            {mode !== 'vertical' && (
              <Portal selector={() => menuRef.current}>
                <Transition enter={visible} during={TTANSITION_DURING_POPUP} afterRender={updatePosition}>
                  {(state) => {
                    let transitionStyle: React.CSSProperties = {};
                    switch (state) {
                      case 'enter':
                        transitionStyle = { transform: inHorizontalNav ? 'scaleY(0.7)' : 'scale(0)', opacity: 0 };
                        break;

                      case 'entering':
                        transitionStyle = {
                          transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-out`).join(', '),
                          transformOrigin,
                        };
                        break;

                      case 'leaving':
                        transitionStyle = {
                          transform: inHorizontalNav ? 'scaleY(0.7)' : 'scale(0)',
                          opacity: 0,
                          transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-in`).join(', '),
                          transformOrigin,
                        };
                        break;

                      case 'leaved':
                        transitionStyle = { display: 'none' };
                        break;

                      default:
                        break;
                    }

                    return renderPopup(
                      <div
                        {...mergeCS(styled('menu-popup'), {
                          style: {
                            minWidth: inHorizontalNav ? undefined : 160,
                            zIndex: `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`,
                            ...popupPositionStyle,
                            ...transitionStyle,
                          },
                        })}
                        ref={popupRef}
                      >
                        <ul {...styled('menu__sub-list')} role="menu" aria-labelledby={id}>
                          {empty ? (
                            <div {...mergeCS(styled('menu__empty'), { style: { paddingLeft: space + level * step } })}>{t('No Data')}</div>
                          ) : (
                            list
                          )}
                        </ul>
                      </div>,
                    );
                  }}
                </Transition>
              </Portal>
            )}
          </>
        )}
      </Popup>
      <CollapseTransition
        originalSize={{
          height: 'auto',
        }}
        collapsedSize={{
          height: 0,
        }}
        enter={mode === 'vertical' ? expand : inNav ? false : (prev) => prev}
        defaultEnter={expand}
        during={TTANSITION_DURING_BASE}
        styles={{
          entering: {
            transition: ['height', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
          },
          leaving: {
            transition: ['height', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
          },
          leaved: { display: 'none' },
        }}
      >
        {(listRef, collapseStyle, state) => {
          if (mode !== 'vertical') {
            if (inNav && state !== 'leaved' && isValidElement(dataRef.current.nodeCache)) {
              return cloneElement(dataRef.current.nodeCache as React.ReactElement, {
                style: { ...dataRef.current.nodeCache.props.style, ...collapseStyle },
              });
            }
            return null;
          }

          const node = (
            <ul {...mergeCS(styled('menu__sub-list'), { style: collapseStyle })} ref={listRef} role="menu" aria-labelledby={id}>
              {empty ? (
                <div {...mergeCS(styled('menu__empty'), { style: { paddingLeft: space + (level + 1) * step } })}>{t('No Data')}</div>
              ) : (
                list
              )}
            </ul>
          );
          if (mode === 'vertical' && inNav) {
            dataRef.current.nodeCache = node;
          }
          return node;
        }}
      </CollapseTransition>
    </>
  );
});
