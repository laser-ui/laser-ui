import type { DatePickerProps } from './types';

import { useAsync, useEventCallback, useImmer, useIsomorphicLayoutEffect, useResize } from '@laser-ui/hooks';
import { setRef } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import CalendarTodayOutlined from '@material-design-icons/svg/outlined/calendar_today.svg?react';
import SwapHorizOutlined from '@material-design-icons/svg/outlined/swap_horiz.svg?react';
import { isArray, isBoolean, isNull, isUndefined } from 'lodash';
import { useImperativeHandle, useRef } from 'react';

import { DatePickerPanel } from './internal/DatePickerPanel';
import { CLASSES } from './vars';
import { BaseInput } from '../base-input';
import { Button } from '../button';
import dayjs from '../dayjs';
import {
  useComponentProps,
  useContainerScrolling,
  useControlled,
  useDesign,
  useLayout,
  useNamespace,
  useScopedProps,
  useStyled,
  useTranslation,
  useZIndex,
} from '../hooks';
import { Icon } from '../icon';
import { Portal } from '../internal/portal';
import { ROOT_DATA } from '../root/vars';
import { TimePickerPanel } from '../time-picker/internal/TimePickerPanel';
import { deepCompareDate, orderDate } from '../time-picker/utils';
import { Transition } from '../transition';
import { getVerticalSidePosition, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';

export function DatePicker(props: DatePickerProps): React.ReactElement | null {
  const {
    ref,
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    visible: visibleProp,
    defaultVisible,
    placeholder,
    range = false,
    format: formatProp,
    order: orderProp = 'ascend',
    clearable: clearableProp = false,
    size: sizeProp,
    disabled: disabledProp = false,
    presetDate,
    config,
    showTime = false,
    escClosable = true,
    inputProps,
    onModelChange,
    onVisibleChange,
    onClear,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('DatePicker', props);

  const namespace = useNamespace();
  const styled = useStyled(
    CLASSES,
    {
      'date-picker': styleProvider?.['date-picker'],
      'time-picker': styleProvider?.['time-picker'],
      'date-picker-popup': styleProvider?.['date-picker-popup'],
    },
    styleOverrides,
  );

  const { t } = useTranslation();
  const async = useAsync();

  const { contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputStartRef = useRef<HTMLInputElement>(null);
  const inputEndRef = useRef<HTMLInputElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<(date: Date) => void>(null);
  const timePickerPanelRef = useRef<(date: Date) => void>(null);
  const updatePanel = (date: Date) => {
    if (visible) {
      panelRef.current?.(date);
      timePickerPanelRef.current?.(date);
    }
  };

  const dataRef = useRef<{
    clearTid?: () => void;
    lastVisible?: 'start' | 'end';
    focusWithoutUser: boolean;
  }>({ focusWithoutUser: false });

  const format = isUndefined(formatProp) ? (showTime ? 'YYYY-MM-DD HH:mm:ss' : `YYYY-MM-DD`) : formatProp;

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);
  const [focused, setFocused] = useImmer<[boolean, boolean]>([false, false]);

  const [value, _changeValue] = useControlled<Date | [Date, Date] | null>(
    defaultModel ?? null,
    model,
    onModelChange,
    (a, b) => deepCompareDate(a, b, format),
    formControl?.control,
  );
  const [placeholderValues, setPlaceholderValues] = useImmer(() => {
    let values: [string, string] = ['', ''];
    if (value) {
      if (range) {
        values = (value as [Date, Date]).map((v) => dayjs(v).format(format)) as [string, string];
      } else {
        values[0] = dayjs(value as Date).format(format);
      }
    }
    return values;
  });
  const newPlaceholderValues = ((): [string, string] | undefined => {
    if (focused.some((f) => f)) {
      return;
    }
    if (isNull(value)) {
      if (placeholderValues.some((p) => p)) {
        return ['', ''];
      }
    } else {
      if (isArray(value)) {
        const currentPlaceholder = value.map((v) => dayjs(v).format(format)) as [string, string];
        if (currentPlaceholder.some((p, i) => p !== placeholderValues[i])) {
          return currentPlaceholder;
        }
      } else {
        const currentPlaceholder = dayjs(value).format(format);
        if (currentPlaceholder !== placeholderValues[0]) {
          return [currentPlaceholder, ''];
        }
      }
    }
  })();
  if (!isUndefined(newPlaceholderValues)) {
    setPlaceholderValues(newPlaceholderValues);
  }
  const placeholderDates = placeholderValues.map((v) => (v && dayjs(v, format, true).isValid() ? dayjs(v, format).toDate() : null)) as [
    Date | null,
    Date | null,
  ];
  const changeValue = (date: Date | [Date, Date] | null) => {
    if (isNull(date)) {
      _changeValue(null);
      setPlaceholderValues(['', '']);
    } else {
      if (range) {
        let newValue = [...placeholderDates];
        if (isArray(date)) {
          newValue = date;
        } else {
          newValue[focused[0] ? 0 : 1] = date;
        }
        if (newValue.every((v) => !isNull(v))) {
          const reverse = orderDate(newValue as [Date, Date], orderProp, showTime ? undefined : 'date');
          if (reverse) {
            newValue.reverse();
            const inputEl = focused[0] ? inputEndRef.current : inputStartRef.current;
            if (inputEl) {
              dataRef.current.focusWithoutUser = true;
              inputEl.focus({ preventScroll: true });
            }
          }
          _changeValue(newValue as [Date, Date]);
        }
        setPlaceholderValues(newValue.map((v) => (v ? dayjs(v).format(format) : '')) as [string, string]);
      } else {
        _changeValue(date);
        setPlaceholderValues([dayjs(date as Date).format(format), '']);
      }
    }
  };
  const handleEnter = (date: Date | [Date, Date]) => {
    if (isArray(date)) {
      updatePanel(date[focused[0] ? 0 : 1]);
      changeVisible(false);
      dataRef.current.lastVisible = focused[0] ? 'start' : 'end';
    } else {
      updatePanel(date);
      if (range) {
        if (placeholderDates[focused[0] ? 1 : 0]) {
          changeVisible(false);
          dataRef.current.lastVisible = focused[0] ? 'start' : 'end';
        } else {
          const inputEl = focused[0] ? inputEndRef.current : inputStartRef.current;
          if (inputEl) {
            dataRef.current.focusWithoutUser = true;
            inputEl.focus({ preventScroll: true });
          }
        }
      } else {
        changeVisible(false);
        dataRef.current.lastVisible = 'start';
      }
    }
  };

  const [placeholderStart = t('DatePicker', range ? 'Start date' : 'Select date'), placeholderEnd = t('DatePicker', 'End date')] = range
    ? ((placeholder as [string?, string?] | undefined) ?? [])
    : [placeholder as string | undefined];

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const zIndexValue = useZIndex(visible);
  const zIndex = `calc(var(--${namespace}-zindex-fixed) + ${zIndexValue})`;

  const updatePosition = useEventCallback(() => {
    if (visible && boxRef.current && popupRef.current) {
      const height = popupRef.current.offsetHeight;
      const maxWidth = ROOT_DATA.windowSize.width - WINDOW_SPACE * 2;
      const width = Math.min(popupRef.current.scrollWidth, maxWidth);
      const position = getVerticalSidePosition(
        boxRef.current,
        { width, height },
        {
          placement: 'bottom-left',
          inWindow: WINDOW_SPACE,
        },
      );
      popupRef.current.style.setProperty(`--popup-down-transform-origin`, position.transformOrigin);
      popupRef.current.style.top = position.top + 'px';
      popupRef.current.style.left = position.left + 'px';
      popupRef.current.style.maxWidth = maxWidth + 'px';
    }
  });
  const updatePanelWhenEnter = useEventCallback(() => {
    const update = () => {
      const date = placeholderDates[focused[0] ? 0 : 1];
      if (date) {
        updatePanel(date);
      }
    };
    if (range) {
      if ((focused[0] ? 'start' : 'end') !== dataRef.current.lastVisible) {
        update();
      }
    } else {
      if (dataRef.current.lastVisible !== 'start') {
        update();
      }
    }
  });

  useContainerScrolling(boxRef, updatePosition, !visible);

  useResize(boxRef, updatePosition, undefined, !visible);
  useResize(popupRef, updatePosition, undefined, !visible);
  useResize(contentResizeRef, updatePosition, undefined, !visible);

  useImperativeHandle(
    ref,
    () => ({
      updatePosition,
    }),
    [updatePosition],
  );

  useIsomorphicLayoutEffect(() => {
    if (boxRef.current && indicatorRef.current) {
      let focus = false;
      const boxRect = boxRef.current.getBoundingClientRect();
      if (inputStartRef.current && document.activeElement === inputStartRef.current) {
        const rect = inputStartRef.current.getBoundingClientRect();
        indicatorRef.current.style.cssText = `left:${rect.left - boxRect.left}px;width:${rect.width}px;opacity:1;`;
        focus = true;
      }
      if (inputEndRef.current && document.activeElement === inputEndRef.current) {
        const rect = inputEndRef.current.getBoundingClientRect();
        indicatorRef.current.style.cssText = `left:${rect.left - boxRect.left}px;width:${rect.width}px;opacity:1;`;
        focus = true;
      }
      if (!focus) {
        indicatorRef.current.style.cssText += 'opacity:0;';
      }
    }
  });

  const clearable = clearableProp && !disabled && !visible && placeholderValues.some((p) => p);
  const inputNode = (isStart: boolean) => {
    const index = isStart ? 0 : 1;
    const inputRef = isStart ? inputStartRef : inputEndRef;

    return (
      <BaseInput
        {...inputProps?.[index]}
        {...mergeCS(styled('date-picker__input'), {
          className: inputProps?.[index]?.className,
          style: inputProps?.[index]?.style,
        })}
        {...formControl?.inputAria}
        ref={(instance) => {
          inputRef.current = instance;
          const ret = setRef(inputProps?.[index]?.ref, instance);
          return () => {
            inputRef.current = null;
            ret();
          };
        }}
        type="text"
        autoComplete="off"
        value={placeholderValues[index]}
        size={22}
        placeholder={isStart ? placeholderStart : placeholderEnd}
        disabled={disabled}
        onValueChange={(val) => {
          const values = [...placeholderValues] as [string, string];
          values[index] = val;
          setPlaceholderValues(values);

          if (range) {
            if (values.every((v) => !v)) {
              _changeValue(null);
            } else if (values.every((v) => v && dayjs(v, format, true).isValid())) {
              const dates = values.map((v) => dayjs(v, format).toDate()) as [Date, Date];
              _changeValue(dates);
              updatePanel(dates[index]);
            }
          } else {
            if (!values[index]) {
              _changeValue(null);
            } else if (values[index] && dayjs(values[index], format, true).isValid()) {
              const date = dayjs(values[index], format).toDate();
              _changeValue(date);
              updatePanel(date);
            }
          }
        }}
        onKeyDown={(e) => {
          inputProps?.[index]?.onKeyDown?.(e);

          if (e.code === 'Escape') {
            if (visible && escClosable) {
              e.stopPropagation();
              e.preventDefault();
              changeVisible(false);
              dataRef.current.lastVisible = isStart ? 'start' : 'end';
            }
          } else if (e.code === 'Enter') {
            if (placeholderDates[index]) {
              e.preventDefault();
              handleEnter(placeholderDates[index]);
            }
          }
        }}
        onFocus={(e) => {
          inputProps?.[index]?.onFocus?.(e);

          dataRef.current.clearTid?.();
          setFocused((draft) => {
            draft.fill(false);
            draft[index] = true;
          });

          if (range && !dataRef.current.focusWithoutUser && placeholderDates[index]) {
            updatePanel(placeholderDates[index]);
          }

          dataRef.current.focusWithoutUser = false;
        }}
        onBlur={(e) => {
          inputProps?.[index]?.onBlur?.(e);

          dataRef.current.clearTid = async.setTimeout(() => {
            setFocused([false, false]);
            changeVisible(false);
            dataRef.current.lastVisible = isStart ? 'start' : 'end';
          }, 20);
        }}
      />
    );
  };

  const preventBlur: React.MouseEventHandler = (e) => {
    if (
      (document.activeElement === inputStartRef.current || document.activeElement === inputEndRef.current) &&
      e.target !== inputStartRef.current &&
      e.target !== inputEndRef.current &&
      e.button === 0
    ) {
      e.preventDefault();
    }
  };

  const designProps = useDesign({ compose: { disabled }, form: formControl });

  return (
    <>
      <div
        {...restProps}
        {...mergeCS(
          styled('date-picker', `date-picker--${size}`, {
            'date-picker.is-disabled': disabled,
          }),
          {
            className: restProps.className,
            style: restProps.style,
          },
        )}
        {...designProps}
        ref={(instance) => {
          boxRef.current = instance;
          return () => {
            boxRef.current = null;
          };
        }}
        onMouseDown={(e) => {
          restProps.onMouseDown?.(e);

          preventBlur(e);
        }}
        onMouseUp={(e) => {
          restProps.onMouseUp?.(e);

          preventBlur(e);
        }}
        onClick={(e) => {
          restProps.onClick?.(e);

          if (!focused.some((f) => f)) {
            dataRef.current.focusWithoutUser = true;
            inputStartRef.current?.focus({ preventScroll: true });
          }
          changeVisible(true);
        }}
      >
        {inputNode(true)}
        {range && (
          <>
            <div
              {...styled('date-picker__indicator')}
              ref={(instance) => {
                indicatorRef.current = instance;
                return () => {
                  indicatorRef.current = null;
                };
              }}
            />
            <div {...styled('date-picker__separator')}>
              <Icon>
                <SwapHorizOutlined />
              </Icon>
            </div>
            {inputNode(false)}
          </>
        )}
        {clearable && (
          <div
            {...styled('date-picker__clear')}
            role="button"
            aria-label={t('Clear')}
            onClick={(e) => {
              e.stopPropagation();

              changeValue(null);
              onClear?.();
            }}
          >
            <Icon>
              <CancelFilled />
            </Icon>
          </div>
        )}
        <div
          {...mergeCS(styled('date-picker__icon'), {
            style: { visibility: clearable ? 'hidden' : undefined },
          })}
        >
          <Icon>
            <CalendarTodayOutlined />
          </Icon>
        </div>
      </div>
      <Portal
        selector={() => {
          let el = document.getElementById(`${namespace}-date-picker-root`);
          if (!el) {
            el = document.createElement('div');
            el.id = `${namespace}-date-picker-root`;
            document.body.appendChild(el);
          }
          return el;
        }}
      >
        <Transition
          enter={visible}
          name={`${namespace}-popup-down`}
          duration={TTANSITION_DURING_POPUP}
          onSkipEnter={() => {
            updatePosition();
            updatePanelWhenEnter();
          }}
          onBeforeEnter={() => {
            updatePosition();
            updatePanelWhenEnter();
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
              {...mergeCS(styled('date-picker-popup'), {
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
              onMouseDown={(e) => {
                preventBlur(e);
              }}
              onMouseUp={(e) => {
                preventBlur(e);
              }}
            >
              {presetDate && (
                <ul {...styled('date-picker__preset')}>
                  {Object.keys(presetDate).map((name) => (
                    <li
                      {...styled('date-picker__preset-option')}
                      key={name}
                      role="button"
                      onClick={() => {
                        const date = presetDate[name]();
                        changeValue(date);
                        handleEnter(date);
                      }}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
              <div {...styled('date-picker__panel-wrapper')}>
                <DatePickerPanel
                  ref={(instance) => {
                    panelRef.current = instance;
                    return () => {
                      panelRef.current = null;
                    };
                  }}
                  styled={styled}
                  currentSelected={placeholderDates[focused[0] ? 0 : 1]}
                  anotherSelected={placeholderDates[focused[0] ? 1 : 0]}
                  config={config ? (...args) => config(...args, focused[0] ? 'start' : 'end', placeholderDates) : undefined}
                  range={range}
                  onDateChange={(date) => {
                    changeValue(date);
                    if (!showTime) {
                      handleEnter(date);
                    }
                  }}
                />
                {showTime && (
                  <TimePickerPanel
                    ref={(instance) => {
                      timePickerPanelRef.current = instance;
                      return () => {
                        timePickerPanelRef.current = null;
                      };
                    }}
                    styled={styled as any}
                    time={placeholderDates[focused[0] ? 0 : 1]}
                    format={format}
                    config={(() => {
                      if (showTime && !isBoolean(showTime)) {
                        const fn = showTime.config;
                        if (fn) {
                          return (...args) => fn(...args, focused[0] ? 'start' : 'end', placeholderDates);
                        }
                      }
                    })()}
                    inDatePicker
                    onTimeChange={(time) => {
                      changeValue(time);
                    }}
                  />
                )}
                <div {...styled('date-picker__footer')}>
                  <Button
                    pattern="link"
                    onClick={() => {
                      const now = new Date();
                      changeValue(now);
                      handleEnter(now);
                    }}
                  >
                    {t('DatePicker', showTime ? 'Now' : 'Today')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </Portal>
    </>
  );
}
