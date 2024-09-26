import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import { isUndefined } from 'lodash';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { useJSS, useTranslation } from '../../hooks';
import { Icon } from '../../icon';
import { Popup } from '../../internal/popup';
import { Portal } from '../../internal/portal';
import { Transition } from '../../internal/transition';
import { getHorizontalSidePosition, mergeCS } from '../../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../../vars';

interface DropdownSubProps {
  children: React.ReactNode;
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  level: number;
  icon: React.ReactNode | undefined;
  list: React.ReactNode;
  popupState: boolean | undefined;
  trigger: 'hover' | 'click';
  empty: boolean;
  focus: boolean;
  disabled: boolean;
  zIndex: number | string | undefined;
  onVisibleChange: (visible: boolean) => void;
}

export const DropdownSub = forwardRef<() => void, DropdownSubProps>((props, ref): JSX.Element | null => {
  const { children, namespace, styled, id, level, icon, list, popupState, trigger, empty, focus, disabled, zIndex, onVisibleChange } =
    props;

  const sheet = useJSS<'position'>();

  const triggerRef = useRef<HTMLLIElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const visible = !isUndefined(popupState);

  const transformOrigin = useRef<string>();
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
      transformOrigin.current = position.transformOrigin;
      if (sheet.classes.position) {
        popupRef.current.classList.toggle(sheet.classes.position, false);
      }
      sheet.replaceRule('position', {
        top: position.top,
        left: position.left,
      });
      popupRef.current.classList.toggle(sheet.classes.position, true);
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
      {({ renderTrigger, renderPopup }) => (
        <>
          {renderTrigger(
            <li
              {...mergeCS(
                styled('dropdown__item', 'dropdown__item--sub', {
                  'dropdown__item.is-expand': visible,
                  'dropdown__item.is-disabled': disabled,
                }),
                { style: { paddingLeft: 12 + level * 16 } },
              )}
              ref={triggerRef}
              id={id}
              role="menuitem"
              aria-haspopup
              aria-expanded={visible}
              aria-disabled={disabled}
            >
              {focus && <div className={`${namespace}-focus-outline`} />}
              {checkNodeExist(icon) && <div {...styled('dropdown__item-icon')}>{icon}</div>}
              <div {...styled('dropdown__item-content')}>{children}</div>
              <div {...styled('dropdown__sub-arrow')}>
                <Icon>
                  <KeyboardArrowRightOutlined />
                </Icon>
              </div>
            </li>,
          )}
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
            <Transition enter={visible} during={TTANSITION_DURING_POPUP} afterRender={updatePosition}>
              {(state) => {
                let transitionStyle: React.CSSProperties = {};
                switch (state) {
                  case 'enter':
                    transitionStyle = { transform: 'scale(0)', opacity: 0 };
                    break;

                  case 'entering':
                    transitionStyle = {
                      transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-out`).join(', '),
                      transformOrigin: transformOrigin.current,
                    };
                    break;

                  case 'leaving':
                    transitionStyle = {
                      transform: 'scale(0)',
                      opacity: 0,
                      transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-in`).join(', '),
                      transformOrigin: transformOrigin.current,
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
                    {...mergeCS(styled('dropdown-popup'), {
                      style: {
                        zIndex,

                        ...transitionStyle,
                      },
                    })}
                    ref={popupRef}
                  >
                    <ul {...styled('dropdown__list')} role="menu" aria-labelledby={id}>
                      {empty ? (
                        <div {...mergeCS(styled('dropdown__empty'), { style: { paddingLeft: 12 + level * 16 } })}>{t('No data')}</div>
                      ) : (
                        list
                      )}
                    </ul>
                  </div>,
                );
              }}
            </Transition>
          </Portal>
        </>
      )}
    </Popup>
  );
});
