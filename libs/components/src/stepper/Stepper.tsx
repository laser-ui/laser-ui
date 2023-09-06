import type { StepperItem, StepperProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { ReactComponent as CheckOutlined } from '@material-design-icons/svg/outlined/check.svg';
import { ReactComponent as CloseOutlined } from '@material-design-icons/svg/outlined/close.svg';
import { isNumber, isUndefined } from 'lodash';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CollapseTransition } from '../internal/transition';
import { Progress } from '../progress';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Stepper<T extends StepperItem>(props: StepperProps<T>): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    active,
    percent,
    dotSize = 36,
    clickable = false,
    labelBottom = false,
    vertical = false,
    onClick,

    ...restProps
  } = useComponentProps('Stepper', props);

  const styled = useStyled(CLASSES, { stepper: styleProvider?.stepper }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('stepper', {
          'stepper--button': clickable,
          'stepper--label-bottom': labelBottom,
          'stepper--vertical': vertical,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
    >
      {list.map((item, index) => {
        const {
          step: itemStep = index + 1,
          title: itemTitle,
          description: itemDescription,
          state: itemState,
          color: itemColor,
          dot: itemDot,
        } = item;

        const isWait = itemStep > active;
        const isActive = itemStep === active;
        const isCompleted = itemStep < active;

        const isProgress = isActive && isNumber(percent);

        const titleNode = (
          <div
            {...mergeCS(styled('stepper__step-title'), {
              style: { marginTop: labelBottom ? undefined : `calc((${dotSize}px - 1.1em) / 2)` },
            })}
          >
            {itemTitle}
          </div>
        );

        const separatoreNode =
          vertical && labelBottom
            ? null
            : index !== list.length - 1 && (
                <div
                  {...mergeCS(styled('stepper__step-separator'), {
                    style: {
                      top: vertical ? `${dotSize}px` : `calc((${dotSize}px - 2px) / 2)`,
                      left: vertical ? `${dotSize / 2}px` : labelBottom ? `calc(50% + ${dotSize / 2}px)` : undefined,
                      width: !vertical && labelBottom ? `calc(100% - ${dotSize}px)` : undefined,
                      height: vertical ? `calc(100% - ${dotSize}px)` : undefined,
                    },
                  })}
                />
              );

        return (
          <div
            {...mergeCS(
              styled(
                'stepper__step',
                isUndefined(itemState)
                  ? {
                      'stepper__step.is-wait': isWait,
                      'stepper__step.is-active': isActive,
                      'stepper__step.is-completed': isCompleted,
                    }
                  : {},
                {
                  [`stepper__step.is-${itemState}`]: itemState,
                },
              ),
              {
                style: {
                  ...{ '--color': itemColor },
                  maxWidth: !vertical && index === list.length - 1 ? `calc(100% / ${list.length})` : undefined,
                  width: !vertical && labelBottom ? `calc(100% / ${list.length})` : undefined,
                },
              },
            )}
            key={itemStep}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (clickable) {
                if (e.code === 'Enter' || e.code === 'Space') {
                  e.preventDefault();

                  onClick?.(itemStep, item);
                }
              }
            }}
            onClick={() => {
              if (clickable) {
                onClick?.(itemStep, item);
              }
            }}
          >
            <div {...styled('stepper__step-header')}>
              <div
                {...mergeCS(
                  styled('stepper__step-dot', {
                    'stepper__step-dot--progress': isProgress,
                  }),
                  { style: { width: dotSize, height: dotSize } },
                )}
              >
                {itemDot === false ? null : checkNodeExist(itemDot) ? (
                  itemDot
                ) : itemState === 'error' ? (
                  <Icon>
                    <CloseOutlined />
                  </Icon>
                ) : isCompleted ? (
                  <Icon>
                    <CheckOutlined />
                  </Icon>
                ) : (
                  itemStep
                )}
                {isProgress && (
                  <div {...styled('stepper__step-progress')}>
                    <Progress percent={percent} pattern="circle" state="process" label={false} size={dotSize + 8} lineWidth={4} />
                  </div>
                )}
              </div>
              {!labelBottom && titleNode}
              {!vertical && separatoreNode}
            </div>
            {labelBottom && titleNode}
            {vertical && separatoreNode}
            {checkNodeExist(itemDescription) && (
              <CollapseTransition
                originalSize={{
                  height: 'auto',
                }}
                collapsedSize={{
                  height: 0,
                }}
                enter={!vertical || isActive}
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
                {(descriptionRef, collapseStyle) => (
                  <div
                    {...mergeCS(styled('stepper__step-description'), {
                      style: { marginLeft: labelBottom ? undefined : `calc(${dotSize}px + 8px)`, ...collapseStyle },
                    })}
                    ref={descriptionRef}
                  >
                    {itemDescription}
                  </div>
                )}
              </CollapseTransition>
            )}
          </div>
        );
      })}
    </div>
  );
}
