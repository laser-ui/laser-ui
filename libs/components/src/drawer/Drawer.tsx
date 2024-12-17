import type { DrawerProps } from './types';

import { isString, isUndefined } from 'lodash';
import { use, useId, useRef, useState } from 'react';

import { DrawerFooter } from './DrawerFooter';
import { DrawerHeader } from './DrawerHeader';
import { CLASSES, DrawerContext } from './vars';
import { useComponentProps, useLockScroll, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { LazyLoading } from '../internal/lazy-loading';
import { Portal } from '../internal/portal';
import { Mask } from '../mask';
import { Transition } from '../transition';
import { handleModalKeyDown, mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export const Drawer: {
  (props: DrawerProps): React.ReactElement | null;
  Header: typeof DrawerHeader;
  Footer: typeof DrawerFooter;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible,
    header: headerProp,
    footer,
    placement = 'right',
    width = 400,
    height = 280,
    mask = true,
    maskClosable = true,
    escClosable = true,
    container,
    skipFirstTransition = true,
    destroyAfterClose = false,
    lazyLoading = true,
    zIndex: zIndexProp,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Drawer', props);

  const isFixed = isUndefined(container);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { drawer: styleProvider?.drawer }, styleOverrides);

  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const prevActiveEl = useRef<HTMLElement>(null);

  const uniqueId = useId();
  const titleId = `${namespace}-drawer-title-${uniqueId}`;
  const bodyId = `${namespace}-drawer-content-${uniqueId}`;

  const drawerContext = use(DrawerContext);
  const handleVisibleChange = (visible: boolean) => {
    if (drawerContentRef.current) {
      drawerContext?.onVisibleChange(
        Object.assign(
          { top: [], right: [], bottom: [], left: [] },
          {
            [placement]: visible
              ? [
                  placement === 'top' || placement === 'bottom'
                    ? drawerContentRef.current.offsetHeight
                    : drawerContentRef.current.offsetWidth,
                ]
              : [],
          },
        ),
      );
    }
  };

  const [offset, setOffset] = useState(0);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp)
    ? zIndexProp
    : !isFixed
      ? `var(--${namespace}-zindex-absolute)`
      : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  useLockScroll(isFixed && visible);

  return (
    <Portal
      selector={
        isUndefined(container)
          ? () => {
              let el = document.getElementById(`${namespace}-drawer-root`);
              if (!el) {
                el = document.createElement('div');
                el.id = `${namespace}-drawer-root`;
                document.body.appendChild(el);
              }
              return el;
            }
          : container
      }
    >
      <Transition
        enter={visible}
        name={`${namespace}-drawer`}
        duration={TTANSITION_DURING_BASE}
        skipFirstTransition={skipFirstTransition}
        onSkipEnter={() => {
          handleVisibleChange(true);
        }}
        onBeforeEnter={() => {
          handleVisibleChange(true);
        }}
        onAfterEnter={() => {
          afterVisibleChange?.(true);

          prevActiveEl.current = document.activeElement as HTMLElement | null;
          if (drawerRef.current) {
            drawerRef.current.focus({ preventScroll: true });
          }
        }}
        onSkipLeave={() => {
          handleVisibleChange(false);
        }}
        onBeforeLeave={() => {
          handleVisibleChange(false);
        }}
        onAfterLeave={() => {
          afterVisibleChange?.(false);

          if (prevActiveEl.current) {
            prevActiveEl.current.focus({ preventScroll: true });
          }
        }}
      >
        {(transitionRef, leaved) => (
          <LazyLoading hidden={leaved} disabled={!lazyLoading}>
            {leaved && destroyAfterClose ? null : (
              <DrawerContext
                value={{
                  id: titleId,
                  onClose: () => {
                    onClose?.();
                  },
                  onVisibleChange: (offsets) => {
                    const offset = offsets[placement].reduce((sum, v) => Math.min((v / 3) * 2, 200) + sum, 0);
                    setOffset(offset);
                    if (drawerContentRef.current) {
                      drawerContext?.onVisibleChange({
                        ...offsets,
                        [placement]: [
                          placement === 'top' || placement === 'bottom'
                            ? drawerContentRef.current.offsetHeight
                            : drawerContentRef.current.offsetWidth,
                        ].concat(offsets[placement]),
                      });
                    }
                  },
                }}
              >
                <div
                  {...restProps}
                  {...mergeCS(styled('drawer', `drawer--${placement}`), {
                    className: restProps.className,
                    style: {
                      ...restProps.style,
                      ...{
                        '--drawer-transform':
                          placement === 'top'
                            ? 'translate(0, -100%)'
                            : placement === 'right'
                              ? 'translate(100%, 0)'
                              : placement === 'bottom'
                                ? 'translate(0, 100%)'
                                : 'translate(-100%, 0)',
                      },
                      position: isFixed ? undefined : 'absolute',
                      zIndex,
                      transform:
                        placement === 'top'
                          ? `translateY(${offset}px)`
                          : placement === 'right'
                            ? `translateX(-${offset}px)`
                            : placement === 'bottom'
                              ? `translateY(-${offset}px)`
                              : `translateX(${offset}px)`,
                      ...(leaved ? { display: 'none' } : undefined),
                    },
                  })}
                  ref={(instance) => {
                    drawerRef.current = instance;
                    return () => {
                      drawerRef.current = null;
                    };
                  }}
                  tabIndex={restProps.tabIndex ?? -1}
                  role="dialog"
                  aria-modal
                  aria-labelledby={headerProp ? titleId : undefined}
                  aria-describedby={bodyId}
                  onKeyDown={(e) => {
                    restProps.onKeyDown?.(e);

                    if (visible && escClosable && e.code === 'Escape') {
                      e.stopPropagation();
                      e.preventDefault();
                      onClose?.();
                    }

                    handleModalKeyDown(e);
                  }}
                >
                  {mask && (
                    <Mask
                      visible={visible}
                      onClose={() => {
                        if (maskClosable) {
                          onClose?.();
                        }
                      }}
                    />
                  )}
                  <div
                    {...mergeCS(styled('drawer__content'), {
                      style: {
                        width: placement === 'left' || placement === 'right' ? width : undefined,
                        height: placement === 'bottom' || placement === 'top' ? height : undefined,
                      },
                    })}
                    ref={(instance) => {
                      drawerContentRef.current = instance;
                      transitionRef(instance);
                      return () => {
                        drawerContentRef.current = null;
                        transitionRef(null);
                      };
                    }}
                  >
                    {isString(headerProp) ? <DrawerHeader>{headerProp}</DrawerHeader> : headerProp}
                    <div {...styled('drawer__body')} id={bodyId}>
                      {children}
                    </div>
                    {footer}
                  </div>
                </div>
              </DrawerContext>
            )}
          </LazyLoading>
        )}
      </Transition>
    </Portal>
  );
};

Drawer.Header = DrawerHeader;
Drawer.Footer = DrawerFooter;
