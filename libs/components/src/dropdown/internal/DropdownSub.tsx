import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import { isUndefined } from 'lodash';
import { useImperativeHandle, useRef } from 'react';

import { Icon } from '../../icon';
import { Popup } from '../../internal/popup';
import { Portal } from '../../internal/portal';
import { Transition } from '../../transition';
import { getHorizontalSidePosition, mergeCS } from '../../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../../vars';

interface DropdownSubProps {
  ref?: React.RefCallback<() => void>;
  children: React.ReactNode;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  icon: React.ReactNode | undefined;
  theme: 'primary' | 'success' | 'warning' | 'danger' | undefined;
  list: React.ReactNode;
  popupState: boolean | undefined;
  trigger: 'hover' | 'click';
  focus: boolean;
  disabled: boolean;
  zIndex: number | string | undefined;
  onVisibleChange: (visible: boolean) => void;
}

export function DropdownSub(props: DropdownSubProps): React.ReactElement | null {
  const { ref, children, namespace, styled, id, icon, theme, list, popupState, trigger, focus, disabled, zIndex, onVisibleChange } = props;

  const triggerRef = useRef<HTMLLIElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const visible = !isUndefined(popupState);

  const updatePosition = useEventCallback(() => {
    if (!disabled && visible && popupRef.current && triggerRef.current) {
      const [width, height] = [popupRef.current.offsetWidth, popupRef.current.offsetHeight];
      const position = getHorizontalSidePosition(
        triggerRef.current,
        { width, height },
        {
          placement: 'right',
          inWindow: WINDOW_SPACE,
        },
      );
      popupRef.current.style.setProperty(`--popup-transform-origin`, position.transformOrigin);
      popupRef.current.style.top = position.top + 'px';
      popupRef.current.style.left = position.left + 'px';
    }
  });

  useImperativeHandle(ref, () => updatePosition, [updatePosition]);

  return (
    <Popup
      visible={popupState ?? false}
      trigger={trigger}
      disabled={disabled}
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
            {...styled('dropdown__item', 'dropdown__item--sub', {
              [`dropdown__item.t-${theme}`]: !disabled && theme,
              'dropdown__item.is-expand': visible,
              'dropdown__item.is-disabled': disabled,
            })}
            ref={(instance) => {
              triggerRef.current = instance;
              return () => {
                triggerRef.current = null;
              };
            }}
            id={id}
            role="menuitem"
            aria-haspopup
            aria-expanded={visible}
            aria-disabled={disabled}
            {...popupProps.trigger}
          >
            {focus && <div className={`${namespace}-focus-outline`} />}
            {checkNodeExist(icon) && <div {...styled('dropdown__item-icon')}>{icon}</div>}
            <div {...styled('dropdown__item-content')}>{children}</div>
            <div {...styled('dropdown__sub-arrow')}>
              <Icon>
                <KeyboardArrowRightOutlined />
              </Icon>
            </div>
          </li>
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
              name={`${namespace}-popup`}
              duration={TTANSITION_DURING_POPUP}
              onSkipEnter={updatePosition}
              onBeforeEnter={updatePosition}
            >
              {(transitionRef, leaved) => (
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
                  {list}
                </div>
              )}
            </Transition>
          </Portal>
        </>
      )}
    </Popup>
  );
}
