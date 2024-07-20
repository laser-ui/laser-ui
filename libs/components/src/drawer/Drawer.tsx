import type { DrawerProps } from './types';
import type { Offsets } from './types';
import type { TransitionState } from '../internal/transition/types';

import { isString, isUndefined } from 'lodash';
import { cloneElement, useCallback, useContext, useEffect, useId, useRef } from 'react';

import { DrawerFooter } from './DrawerFooter';
import { DrawerHeader } from './DrawerHeader';
import { CLASSES, DrawerContext } from './vars';
import { useComponentProps, useLockScroll, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { Mask } from '../internal/mask';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { handleModalKeyDown, mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export const Drawer: {
  (props: DrawerProps): JSX.Element | null;
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
    destroyAfterClose = true,
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

  const dataRef = useRef<{
    prevActiveEl: HTMLElement | null;
  }>({
    prevActiveEl: null,
  });

  const uniqueId = useId();
  const titleId = `${namespace}-drawer-title-${uniqueId}`;
  const bodyId = `${namespace}-drawer-content-${uniqueId}`;

  const drawerContext = useContext(DrawerContext);
  const drawerContextValue = useCallback(
    (offsets: Offsets) => {
      const offset = offsets[placement].reduce((sum, v) => Math.min((v / 3) * 2, 200) + sum, 0);
      if (drawerRef.current) {
        drawerRef.current.style.transform =
          placement === 'top'
            ? `translateY(${offset}px)`
            : placement === 'right'
              ? `translateX(-${offset}px)`
              : placement === 'bottom'
                ? `translateY(-${offset}px)`
                : `translateX(${offset}px)`;
      }
      if (drawerContentRef.current) {
        drawerContext({
          ...offsets,
          [placement]: [
            placement === 'top' || placement === 'bottom' ? drawerContentRef.current.offsetHeight : drawerContentRef.current.offsetWidth,
          ].concat(offsets[placement]),
        });
      }
    },
    [drawerContext, placement],
  );
  const handleVisibleChange = (visible: boolean) => {
    if (drawerContentRef.current) {
      drawerContext(
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
  useEffect(() => {
    if (!visible) {
      handleVisibleChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp)
    ? zIndexProp
    : !isFixed
      ? `var(--${namespace}-zindex-absolute)`
      : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  useLockScroll(isFixed && visible);

  const transitionStyles: { [K in TransitionState]?: React.CSSProperties } = (() => {
    const transform =
      placement === 'top'
        ? 'translate(0, -100%)'
        : placement === 'right'
          ? 'translate(100%, 0)'
          : placement === 'bottom'
            ? 'translate(0, 100%)'
            : 'translate(-100%, 0)';

    return {
      enter: { transform },
      entering: {
        transition: ['transform'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
      },
      leaving: {
        transform,
        transition: ['transform'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
      },
      leaved: { transform },
    };
  })();

  const headerNode = (() => {
    if (headerProp) {
      const node = isString(headerProp) ? <DrawerHeader>{headerProp}</DrawerHeader> : headerProp;
      return cloneElement(node, {
        _id: titleId,
        _onClose: () => {
          onClose?.();
        },
      });
    }
  })();

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
        during={TTANSITION_DURING_BASE}
        skipFirstTransition={skipFirstTransition}
        destroyWhenLeaved={destroyAfterClose}
        afterRender={() => {
          handleVisibleChange(true);
        }}
        afterEnter={() => {
          afterVisibleChange?.(true);

          dataRef.current.prevActiveEl = document.activeElement as HTMLElement | null;
          if (drawerRef.current) {
            drawerRef.current.focus({ preventScroll: true });
          }
        }}
        afterLeave={() => {
          afterVisibleChange?.(false);

          if (dataRef.current.prevActiveEl) {
            dataRef.current.prevActiveEl.focus({ preventScroll: true });
          }
        }}
      >
        {(state) => (
          <div
            {...restProps}
            {...mergeCS(styled('drawer', `drawer--${placement}`), {
              className: restProps.className,
              style: {
                ...restProps.style,
                display: state === 'leaved' ? 'none' : undefined,
                position: isFixed ? undefined : 'absolute',
                zIndex,
              },
            })}
            ref={drawerRef}
            tabIndex={restProps.tabIndex ?? -1}
            role="dialog"
            aria-modal
            aria-labelledby={headerNode ? titleId : undefined}
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
                  ...transitionStyles[state],
                },
              })}
              ref={drawerContentRef}
            >
              {headerNode}
              <div {...styled('drawer__body')} id={bodyId}>
                <DrawerContext.Provider value={drawerContextValue}>{children}</DrawerContext.Provider>
              </div>
              {footer &&
                cloneElement(footer, {
                  _onClose: () => {
                    onClose?.();
                  },
                })}
            </div>
          </div>
        )}
      </Transition>
    </Portal>
  );
};

Drawer.Header = DrawerHeader;
Drawer.Footer = DrawerFooter;
