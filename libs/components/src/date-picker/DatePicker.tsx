import type { DatePickerProps } from './types';

import { useAsync, useEventCallback, useForceUpdate, useImmer, useIsomorphicLayoutEffect, useResize } from '@laser-ui/hooks';
import { setRef } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import CalendarTodayOutlined from '@material-design-icons/svg/outlined/calendar_today.svg?react';
import SwapHorizOutlined from '@material-design-icons/svg/outlined/swap_horiz.svg?react';
import { isArray, isBoolean, isNull, isUndefined } from 'lodash';
import { useEffect, useImperativeHandle, useRef } from 'react';

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
  const forceUpdate = useForceUpdate();
  const async = useAsync();

  const { contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputLeftRef = useRef<HTMLInputElement>(null);
  const inputRightRef = useRef<HTMLInputElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<(date: Date) => void>(null);
  const timePickerPanelRef = useRef<(date: Date) => void>(null);
  const updatePanel = (date: Date) => {
    panelRef.current?.(date);
    timePickerPanelRef.current?.(date);
  };

  const dataRef = useRef<{
    clearTid?: () => void;
    latestFocused: 'start' | 'end';
    onceVisible: boolean;
    focusAnother: boolean;
    inputValue: [string?, string?];
    rangeDate: [Date | null, Date | null];
  }>({
    latestFocused: 'start',
    onceVisible: false,
    focusAnother: false,
    inputValue: [undefined, undefined],
    rangeDate: [null, null],
  });

  const format = isUndefined(formatProp) ? (showTime ? 'YYYY-MM-DD HH:mm:ss' : `YYYY-MM-DD`) : formatProp;
  const order = (date: [Date, Date]) => orderDate(date, orderProp, showTime ? undefined : 'date');

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const [focused, setFocused] = useImmer<[boolean, boolean]>([false, false]);
  if (focused[0]) {
    dataRef.current.latestFocused = 'start';
  }
  if (focused[1]) {
    dataRef.current.latestFocused = 'end';
  }

  const [_value, _changeValue] = useControlled<Date | [Date, Date] | null>(
    defaultModel ?? null,
    model,
    onModelChange,
    (a, b) => deepCompareDate(a, b, format),
    formControl?.control,
  );
  let [valueLeft, valueRight = null] = range ? ((_value as [Date, Date] | null) ?? [null, null]) : [_value as Date | null, null];
  if (range) {
    if (isNull(_value)) {
      [valueLeft, valueRight] = dataRef.current.rangeDate;
    } else {
      dataRef.current.rangeDate = [null, null];
    }
  }
  const inputValue = [0, 1].map((index) =>
    focused[index] && !isUndefined(dataRef.current.inputValue[index])
      ? (dataRef.current.inputValue[index] as string)
      : (() => {
          const value = index === 0 ? valueLeft : valueRight;
          return isNull(value) ? '' : dayjs(value).format(format);
        })(),
  );
  const changeValue = (date: Date) => {
    const index = focused.findIndex((f) => f);
    if (range) {
      if (isNull(_value)) {
        dataRef.current.rangeDate[index] = date;
        if (dataRef.current.rangeDate.every((v) => !isNull(v))) {
          dataRef.current.focusAnother = order(dataRef.current.rangeDate as [Date, Date]);
          if (dataRef.current.focusAnother) {
            dataRef.current.rangeDate.reverse();
          }
          dataRef.current.inputValue = [undefined, undefined];
          _changeValue(dataRef.current.rangeDate as [Date, Date]);
        }
      } else {
        dataRef.current.inputValue = [undefined, undefined];
        _changeValue((draft) => {
          (draft as [Date, Date])[index] = date;
          dataRef.current.focusAnother = order(draft as [Date, Date]);
          if (dataRef.current.focusAnother) {
            (draft as [Date, Date]).reverse();
          }
        });
      }
    } else {
      dataRef.current.inputValue = [undefined, undefined];
      _changeValue(date);
    }
    forceUpdate();
  };

  const [placeholderLeft = t('DatePicker', range ? 'Start date' : 'Select date'), placeholderRight = t('DatePicker', 'End date')] = range
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
      if (inputLeftRef.current && document.activeElement === inputLeftRef.current) {
        const rect = inputLeftRef.current.getBoundingClientRect();
        indicatorRef.current.style.cssText = `left:${rect.left - boxRect.left}px;width:${rect.width}px;opacity:1;`;
        focus = true;
      }
      if (inputRightRef.current && document.activeElement === inputRightRef.current) {
        const rect = inputRightRef.current.getBoundingClientRect();
        indicatorRef.current.style.cssText = `left:${rect.left - boxRect.left}px;width:${rect.width}px;opacity:1;`;
        focus = true;
      }
      if (!focus) {
        indicatorRef.current.style.cssText += 'opacity:0;';
      }
    }
  });

  useEffect(() => {
    if (dataRef.current.focusAnother && document.activeElement) {
      const el = document.activeElement.parentElement as HTMLElement;
      for (let index = 0; index < el.childElementCount; index++) {
        const element = el.children.item(index) as HTMLElement;
        if (element.tagName.toLowerCase() === 'input' && element !== document.activeElement) {
          element.focus({ preventScroll: true });
          break;
        }
      }
    }
    dataRef.current.focusAnother = false;
  });

  const handleEnter = (date: Date) => {
    if (range) {
      const index = focused.findIndex((f) => f);
      if (isNull(index === 0 ? valueRight : valueLeft)) {
        dataRef.current.focusAnother = true;
        forceUpdate();
      } else {
        changeVisible(false);
      }
    } else {
      changeVisible(false);
    }
    if (!dataRef.current.focusAnother) {
      updatePanel(date);
    }
  };

  const clearable = clearableProp && !isNull(_value) && !visible && !disabled;
  const inputNode = (isLeft: boolean) => {
    const index = isLeft ? 0 : 1;
    const value = isLeft ? valueLeft : valueRight;
    const inputRef = isLeft ? inputLeftRef : inputRightRef;

    return (
      <BaseInput
        {...inputProps?.[index]}
        {...styled('date-picker__input')}
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
        value={inputValue[index]}
        size={22}
        placeholder={isLeft ? placeholderLeft : placeholderRight}
        disabled={disabled}
        onValueChange={(val) => {
          forceUpdate();
          dataRef.current.inputValue[index] = val;

          if (dayjs(val, format, true).isValid()) {
            const date = dayjs(val, format).toDate();
            changeValue(date);
            updatePanel(date);
          }
        }}
        onKeyDown={(e) => {
          inputProps?.[index]?.onKeyDown?.(e);

          if (e.code === 'Escape') {
            if (visible && escClosable) {
              e.stopPropagation();
              e.preventDefault();
              changeVisible(false);
            }
          } else if (e.code === 'Enter' && inputValue[index] && dayjs(inputValue[index], format, true).isValid()) {
            e.preventDefault();
            const date = dayjs(inputValue[index], format).toDate();
            handleEnter(date);
          }
        }}
        onFocus={(e) => {
          inputProps?.[index]?.onFocus?.(e);

          dataRef.current.clearTid?.();
          setFocused((draft) => {
            draft.fill(false);
            draft[isLeft ? 0 : 1] = true;
          });
          dataRef.current.inputValue = [undefined, undefined];

          if (visible && range && value) {
            updatePanel(value);
          }
        }}
        onBlur={(e) => {
          inputProps?.[index]?.onBlur?.(e);

          dataRef.current.clearTid = async.setTimeout(() => {
            setFocused([false, false]);
            changeVisible(false);
          }, 20);
        }}
      />
    );
  };

  const preventBlur: React.MouseEventHandler = (e) => {
    if (
      (document.activeElement === inputLeftRef.current || document.activeElement === inputRightRef.current) &&
      e.target !== inputLeftRef.current &&
      e.target !== inputRightRef.current &&
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
            inputLeftRef.current?.focus({ preventScroll: true });
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

              dataRef.current.inputValue = [undefined, undefined];
              _changeValue(null);
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

            const cb = () => {
              const value = focused[0] ? valueLeft : valueRight;
              if (value) {
                updatePanel(value);
              }
            };
            if (range) {
              cb();
            } else if (!dataRef.current.onceVisible) {
              dataRef.current.onceVisible = true;
              cb();
            }
          }}
          onBeforeEnter={() => {
            updatePosition();

            const cb = () => {
              const value = focused[0] ? valueLeft : valueRight;
              if (value) {
                updatePanel(value);
              }
            };
            if (range) {
              cb();
            } else if (!dataRef.current.onceVisible) {
              dataRef.current.onceVisible = true;
              cb();
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
                  {Object.keys(presetDate).map((name) => {
                    const handleClick = () => {
                      const date = presetDate[name]();
                      dataRef.current.inputValue = [undefined, undefined];
                      if (range) {
                        if (isArray(date)) {
                          _changeValue(date);
                          changeVisible(false);
                        } else {
                          changeValue(date);
                          handleEnter(date);
                        }
                      } else {
                        _changeValue(date);
                        handleEnter(date as Date);
                      }
                    };

                    return (
                      <li {...styled('date-picker__preset-option')} key={name} role="button" onClick={handleClick}>
                        {name}
                      </li>
                    );
                  })}
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
                  currentSelected={dataRef.current.latestFocused === 'start' ? valueLeft : valueRight}
                  anotherSelected={dataRef.current.latestFocused === 'start' ? valueRight : valueLeft}
                  config={config ? (...args) => config(...args, dataRef.current.latestFocused, [valueLeft, valueRight]) : undefined}
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
                    time={dataRef.current.latestFocused === 'start' ? valueLeft : valueRight}
                    format={format}
                    config={
                      showTime && !isBoolean(showTime) && showTime.config
                        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          (...args) => showTime.config!(...args, dataRef.current.latestFocused, [valueLeft, valueRight])
                        : undefined
                    }
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
