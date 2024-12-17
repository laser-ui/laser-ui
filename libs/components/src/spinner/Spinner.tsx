import type { SpinnerProps } from './types';

import { useAsync, useForceUpdate } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import { isNumber, isUndefined } from 'lodash';
import { useEffect, useRef } from 'react';

import { CLASSES } from './vars';
import { CircularProgress } from '../circular-progress';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { Icon } from '../icon';
import { Transition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Spinner(props: SpinnerProps): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible: visibleProp,
    text,
    size = 28,
    delay,
    alone = false,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Spinner', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { spinner: styleProvider?.spinner }, styleOverrides);

  const async = useAsync();
  const forceUpdate = useForceUpdate();

  const spinnerRef = useRef<HTMLDivElement>(null);

  const delayVisible = useRef(false);

  if (visibleProp === false) {
    delayVisible.current = false;
  }
  const visible = isUndefined(delay) ? visibleProp : delayVisible.current;

  useEffect(() => {
    if (isNumber(delay) && visibleProp) {
      const clearTid = async.setTimeout(() => {
        delayVisible.current = true;
        forceUpdate();
      }, delay);

      return () => {
        clearTid();
      };
    }
  }, [async, delay, forceUpdate, visibleProp]);

  return (
    <Transition
      enter={visible}
      name={`${namespace}-fade`}
      duration={TTANSITION_DURING_BASE}
      onSkipEnter={() => {
        if (spinnerRef.current) {
          spinnerRef.current.style.setProperty('--spinner-container-height', `${spinnerRef.current.offsetHeight}px`);
        }
      }}
      onBeforeEnter={() => {
        if (spinnerRef.current) {
          spinnerRef.current.style.setProperty('--spinner-container-height', `${spinnerRef.current.offsetHeight}px`);
        }
      }}
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
          {...mergeCS(
            styled('spinner', {
              'spinner--alone': alone,
            }),
            {
              className: restProps.className,
              style: {
                ...restProps.style,
                ...(leaved ? { display: 'none' } : undefined),
              },
            },
          )}
          ref={(instance) => {
            spinnerRef.current = instance;
            transitionRef(instance);
            return () => {
              spinnerRef.current = null;
              transitionRef(null);
            };
          }}
        >
          <div {...styled('spinner__container')}>
            {children !== false && (
              <div
                {...mergeCS(styled('spinner__icon'), {
                  style: { fontSize: size },
                })}
              >
                {checkNodeExist(children) ? (
                  children
                ) : (
                  <Icon>
                    <CircularProgress />
                  </Icon>
                )}
              </div>
            )}
            {checkNodeExist(text) && <div {...styled('spinner__text')}>{text}</div>}
          </div>
        </div>
      )}
    </Transition>
  );
}
