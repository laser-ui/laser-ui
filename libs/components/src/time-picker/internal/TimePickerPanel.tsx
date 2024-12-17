import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@laser-ui/hooks';
import { scrollTo } from '@laser-ui/utils';
import { freeze } from 'immer';
import { isUndefined } from 'lodash';
import { useImperativeHandle, useRef, useState } from 'react';

import dayjs from '../../dayjs';

const H12 = freeze(['12', ...Array.from({ length: 11 }).map((_, i) => `${i + 1 < 10 ? '0' : ''}${i + 1}`)]);

const [H24, M60, S60] = [24, 60, 60].map((num) => freeze(Array.from({ length: num }).map((_, i) => `${i < 10 ? '0' : ''}${i}`)));

interface TimePickerPanelProps {
  ref?: React.Ref<(date: Date) => void>;
  styled: Styled<typeof CLASSES>;
  time: Date | null;
  format: string;
  config: ((unit: 'hour' | 'minute' | 'second', value: number) => { disabled?: boolean; hidden?: boolean }) | undefined;
  inDatePicker?: boolean;
  onTimeChange: (time: Date) => void;
}

export function TimePickerPanel(props: TimePickerPanelProps): React.ReactElement | null {
  const { ref, styled, time: timeProp, format: formatProp, config, inDatePicker = false, onTimeChange } = props;

  const ulHRef = useRef<HTMLUListElement>(null);
  const ulMRef = useRef<HTMLUListElement>(null);
  const ulSRef = useRef<HTMLUListElement>(null);

  const dataRef = useRef<{
    clearHTid?: () => void;
    clearMTid?: () => void;
    clearSTid?: () => void;
  }>({});

  const is12Hour = formatProp.includes('hh');
  const cols = (() => {
    const cols: string[] = [];
    if (formatProp.toLowerCase().includes('hh')) {
      cols.push('HH');
    }
    if (formatProp.includes('mm')) {
      cols.push('mm');
    }
    if (formatProp.includes('ss')) {
      cols.push('ss');
    }
    return cols;
  })();

  const time = timeProp ? dayjs(timeProp) : dayjs('00:00:00', 'HH:mm:ss');

  const [_a, setA] = useState<'AM' | 'PM'>('AM');
  const a = timeProp ? (time.get('hour') < 12 ? 'AM' : 'PM') : _a;

  const updateView = useEventCallback((t: Date, unit?: 'hour' | 'minute' | 'second', behavior: 'smooth' | 'instant' = 'smooth') => {
    if (unit === 'hour' || isUndefined(unit)) {
      let hour = t.getHours();
      if (is12Hour) {
        if (a === 'AM' && hour > 11) {
          hour -= 12;
        }
        if (a === 'PM' && hour < 12) {
          hour += 12;
        }
      }
      if (ulHRef.current) {
        dataRef.current.clearHTid?.();
        dataRef.current.clearHTid = scrollTo(ulHRef.current, {
          top: Array.prototype.indexOf.call(ulHRef.current.children, ulHRef.current.querySelector(`[data-h="${hour}"]`)) * 28,
          behavior,
          during: 200,
        });
      }
    }

    if (unit === 'minute' || isUndefined(unit)) {
      const minute = t.getMinutes();
      if (ulMRef.current) {
        dataRef.current.clearMTid?.();
        dataRef.current.clearMTid = scrollTo(ulMRef.current, {
          top: Array.prototype.indexOf.call(ulMRef.current.children, ulMRef.current.querySelector(`[data-m="${minute}"]`)) * 28,
          behavior,
          during: 200,
        });
      }
    }

    if (unit === 'second' || isUndefined(unit)) {
      const second = t.getSeconds();
      if (ulSRef.current) {
        dataRef.current.clearSTid?.();
        dataRef.current.clearSTid = scrollTo(ulSRef.current, {
          top: Array.prototype.indexOf.call(ulSRef.current.children, ulSRef.current.querySelector(`[data-s="${second}"]`)) * 28,
          behavior,
          during: 200,
        });
      }
    }
  });

  useImperativeHandle(
    ref,
    () => (t) => {
      updateView(t, undefined, 'instant');
    },
    [updateView],
  );

  return (
    <div {...styled('time-picker__panel')}>
      {inDatePicker && <div {...styled('time-picker__header')}>{time.format(cols.join(':'))}</div>}
      {cols.includes('HH') && (
        <ul
          {...styled('time-picker__column')}
          ref={(instance) => {
            ulHRef.current = instance;
            return () => {
              ulHRef.current = null;
            };
          }}
        >
          {(is12Hour ? H12 : H24).map((n) => {
            let hour = Number(n);
            if (is12Hour) {
              if (a === 'AM' && hour === 12) {
                hour = 0;
              }
              if (a === 'PM' && hour !== 12) {
                hour += 12;
              }
            }
            const { disabled, hidden } = config?.('hour', hour) ?? {};

            return hidden ? null : (
              <li
                {...styled('time-picker__cell', {
                  'time-picker__cell.is-active': timeProp && time.get('hour') === hour,
                  'time-picker__cell.is-disabled': disabled,
                })}
                key={hour}
                data-h={hour}
                onClick={() => {
                  const newTime = time.set('hour', hour).toDate();
                  updateView(newTime, 'hour');
                  onTimeChange(newTime);
                }}
              >
                {n}
              </li>
            );
          })}
        </ul>
      )}
      {cols.includes('mm') && (
        <ul
          {...styled('time-picker__column')}
          ref={(instance) => {
            ulMRef.current = instance;
            return () => {
              ulMRef.current = null;
            };
          }}
        >
          {M60.map((n) => {
            const minute = Number(n);
            const { disabled, hidden } = config?.('minute', minute) ?? {};

            return hidden ? null : (
              <li
                {...styled('time-picker__cell', {
                  'time-picker__cell.is-active': timeProp && time.get('minute') === minute,
                  'time-picker__cell.is-disabled': disabled,
                })}
                key={minute}
                data-m={minute}
                onClick={() => {
                  const newTime = time.set('minute', minute).toDate();
                  updateView(newTime, 'minute');
                  onTimeChange(newTime);
                }}
              >
                {n}
              </li>
            );
          })}
        </ul>
      )}
      {cols.includes('ss') && (
        <ul
          {...styled('time-picker__column')}
          ref={(instance) => {
            ulSRef.current = instance;
            return () => {
              ulSRef.current = null;
            };
          }}
        >
          {S60.map((n) => {
            const second = Number(n);
            const { disabled, hidden } = config?.('second', second) ?? {};

            return hidden ? null : (
              <li
                {...styled('time-picker__cell', {
                  'time-picker__cell.is-active': timeProp && time.get('second') === second,
                  'time-picker__cell.is-disabled': disabled,
                })}
                key={second}
                data-s={second}
                onClick={() => {
                  const newTime = time.set('second', second).toDate();
                  updateView(newTime, 'second');
                  onTimeChange(newTime);
                }}
              >
                {n}
              </li>
            );
          })}
        </ul>
      )}
      {is12Hour && (
        <ul {...styled('time-picker__column')}>
          {(['AM', 'PM'] as const).map((A) => (
            <li
              {...styled('time-picker__cell', {
                'time-picker__cell.is-active': a === A,
              })}
              key={A}
              onClick={() => {
                if (timeProp) {
                  if (a !== A) {
                    const newT = time.set('hour', time.get('hour') + (A === 'AM' ? -12 : 12)).toDate();
                    onTimeChange(newT);
                  }
                } else {
                  setA(A);
                }
              }}
            >
              {A}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
