import type { ProgressProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import CheckCircleFilled from '@material-design-icons/svg/filled/check_circle.svg?react';
import WarningFilled from '@material-design-icons/svg/filled/warning.svg?react';
import CheckOutlined from '@material-design-icons/svg/outlined/check.svg?react';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import WarningAmberOutlined from '@material-design-icons/svg/outlined/warning_amber.svg?react';
import { isUndefined } from 'lodash';
import { useId } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function Progress(props: ProgressProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    percent,
    pattern = 'line',
    state: stateProp,
    label,
    size = 120,
    wave = false,
    lineCap = 'round',
    lineWidth = 8,
    gapDegree = 75,
    linearGradient,

    ...restProps
  } = useComponentProps('Progress', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { progress: styleProvider?.progress }, styleOverrides);

  const uniqueId = useId();

  const state = isUndefined(stateProp) ? (percent === 100 ? 'success' : 'process') : stateProp;

  return (
    <div
      {...restProps}
      {...mergeCS(styled('progress', `progress--${pattern}`, `progress--${state}`), {
        className: restProps.className,
        style: restProps.style,
      })}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {pattern === 'line' ? (
        <div
          {...mergeCS(styled('progress__line-track'), {
            style: { height: lineWidth, borderRadius: lineCap === 'round' ? lineWidth / 2 : 0 },
          })}
        >
          <div
            {...mergeCS(styled('progress__line-bar'), {
              style: {
                opacity: percent === 0 ? 0 : 1,
                width: `${percent}%`,
                backgroundImage: linearGradient
                  ? `linear-gradient(to right, ${linearGradient[0]} 0%, ${linearGradient[100]} 100%)`
                  : undefined,
              },
            })}
          >
            {wave && percent > 0 && <div {...styled('progress__line-wave')} />}
          </div>
        </div>
      ) : (
        (() => {
          const r = 60 - lineWidth / 2;
          const c = 2 * Math.PI * r;
          const dash = c - (pattern === 'circle' ? 0 : (gapDegree / 360) * c);

          return (
            <Icon size={size} rotate={pattern === 'circle' ? -90 : 90 + gapDegree / 2}>
              <svg {...styled('progress__svg')} viewBox="0 0 120 120">
                {linearGradient && (
                  <defs>
                    <linearGradient id={`${namespace}-progress-gradient-${uniqueId}-1`} gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={linearGradient[0]} />
                      <stop offset="100%" stopColor={linearGradient[100]} />
                    </linearGradient>
                  </defs>
                )}
                <circle
                  cx={60}
                  cy={60}
                  r={r}
                  strokeLinecap={lineCap}
                  strokeWidth={lineWidth}
                  stroke="var(--background-color)"
                  fill="none"
                  strokeDasharray={`${dash} ${c}`}
                />
                <circle
                  style={{ opacity: percent === 0 ? 0 : 1 }}
                  cx={60}
                  cy={60}
                  r={r}
                  strokeLinecap={lineCap}
                  strokeWidth={lineWidth}
                  stroke={isUndefined(linearGradient) ? 'var(--color)' : `url(#${namespace}-progress-gradient-${uniqueId}-1)`}
                  fill="none"
                  strokeDasharray={`${dash * (percent / 100)} ${c}`}
                />
              </svg>
            </Icon>
          );
        })()
      )}
      {label !== false && (
        <div
          {...mergeCS(styled('progress__label'), {
            style: { fontSize: pattern === 'line' ? undefined : `calc(${size}px / 5)` },
          })}
        >
          {checkNodeExist(label) ? (
            label
          ) : state === 'process' ? (
            `${percent}%`
          ) : (
            <Icon size="1.25em">
              {state === 'success' ? (
                pattern === 'line' ? (
                  <CheckCircleFilled />
                ) : (
                  <CheckOutlined />
                )
              ) : state === 'warning' ? (
                pattern === 'line' ? (
                  <WarningFilled />
                ) : (
                  <WarningAmberOutlined />
                )
              ) : pattern === 'line' ? (
                <CancelFilled />
              ) : (
                <CloseOutlined />
              )}
            </Icon>
          )}
        </div>
      )}
    </div>
  );
}
