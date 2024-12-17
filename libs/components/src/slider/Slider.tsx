import type { SliderProps } from './types';
import type { TooltipRef } from '../tooltip';

import { useEvent, useIsomorphicLayoutEffect, useRefExtra } from '@laser-ui/hooks';
import { isArray, isNull, isNumber, toNumber } from 'lodash';
import { useRef, useState } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useDesign, useScopedProps, useStyled } from '../hooks';
import { Tooltip } from '../tooltip';
import { mergeCS } from '../utils';

export function Slider(props: SliderProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    max = 100,
    min = 0,
    step = 1,
    range = false,
    rangeMinDistance,
    rangeThumbDraggable = false,
    tooltip,
    customTooltip,
    marks,
    vertical = false,
    reverse = false,
    disabled: disabledProp = false,
    inputProps,
    onModelChange,

    ...restProps
  } = useComponentProps('Slider', props);

  const styled = useStyled(CLASSES, { slider: styleProvider?.slider }, styleOverrides);

  const sliderRef = useRef<HTMLDivElement>(null);
  const dotLeftRef = useRef<HTMLDivElement>(null);
  const dotRightRef = useRef<HTMLDivElement>(null);
  const tooltipLeftRef = useRef<TooltipRef>(null);
  const tooltipRightRef = useRef<TooltipRef>(null);
  const windowRef = useRefExtra(() => window);

  const [dotFocused, setDotFocused] = useState<'left' | 'right' | null>(null);
  const [dotVisible, setDotVisible] = useState<'left' | 'right' | null>(null);
  const [dotDraggable, setDotDraggable] = useState<'left' | 'right' | null>(null);
  const [thumbDraggingPoint, setThumbDraggingPoint] = useState<{ left: number; right: number; clientX: number; clientY: number } | null>(
    null,
  );

  const [value, changeValue] = useControlled<number | [number, number]>(
    defaultModel ?? (range ? [0, 0] : 0),
    model,
    onModelChange,
    (a, b) => {
      if (isNumber(a) && isNumber(b)) {
        return a === b;
      } else if (isArray(a) && isArray(b)) {
        return a[0] === b[0] && a[1] === b[1];
      }
      return false;
    },
    formControl?.control,
  );

  const [valueLeft, valueRight = 0] = (range ? value : [value]) as [number, number?];
  const [visibleLeft, visibleRight] = (() => {
    if (range) {
      return [
        (tooltip as any)?.[0] ?? (dotVisible === 'left' ? true : !!(dotFocused === 'left' || thumbDraggingPoint)),
        (tooltip as any)?.[1] ?? (dotVisible === 'right' ? true : !!(dotFocused === 'right' || thumbDraggingPoint)),
      ];
    } else {
      return [tooltip ?? (dotVisible === 'left' ? true : !!(dotFocused === 'left' || thumbDraggingPoint)), false];
    }
  })() as [boolean, boolean];

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  const getValue = (value: number, func: 'round' | 'ceil' | 'floor' = 'round') => {
    let newValue: number | null = null;
    if (step) {
      const n = Math[func](value / step);
      newValue = Math.min(max, Math.max(min, n * step));
    }

    if (isArray(marks)) {
      let min = newValue ? Math.abs(newValue - value) : Infinity;
      if (min > 0) {
        for (const mark of marks) {
          const v: number = isNumber(mark) ? mark : mark.value;
          if (func === 'round' || (func === 'ceil' && v - value >= 0) || (func === 'floor' && v - value <= 0)) {
            const offset = Math.abs(v - value);
            if (offset < min) {
              min = offset;
              newValue = v;
            }
          }
        }
      }
    }

    return newValue ?? min;
  };

  const handleMove = (e: { clientX: number; clientY: number }, isLeft?: boolean) => {
    isLeft = isLeft ?? dotFocused === 'left';
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const newValue = getValue(
        (max - min) *
          (vertical
            ? (reverse ? e.clientY - rect.top : rect.bottom - e.clientY) / rect.height
            : (reverse ? rect.right - e.clientX : e.clientX - rect.left) / rect.width),
      );

      if (range) {
        changeValue((draft: any) => {
          const index = isLeft ? 0 : 1;

          if (draft[index] !== newValue) {
            const offset = newValue - draft[index];
            const isAdd = offset > 0;
            draft[index] = newValue;
            if (isNumber(rangeMinDistance) && draft[1] - draft[0] < rangeMinDistance) {
              const _index = isLeft ? 1 : 0;
              draft[_index] = getValue(draft[_index] + offset, isAdd ? 'ceil' : 'floor');
              if (draft[1] - draft[0] < rangeMinDistance) {
                draft[index] = getValue(draft[_index] + (isAdd ? -rangeMinDistance : rangeMinDistance), isAdd ? 'floor' : 'ceil');
              }
            }
          }
        });
      } else {
        changeValue(newValue);
      }
    }
  };

  const handleThumbMove = (e: { clientX: number; clientY: number }) => {
    if (step && thumbDraggingPoint && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const offset =
        Math.round(
          ((max - min) *
            (vertical
              ? (reverse ? e.clientY - thumbDraggingPoint.clientY : thumbDraggingPoint.clientY - e.clientY) / rect.height
              : (reverse ? thumbDraggingPoint.clientX - e.clientX : e.clientX - thumbDraggingPoint.clientX) / rect.width)) /
            step,
        ) * step;
      const value: [number, number] = [0, 0];
      let index = -1;

      for (const v of [thumbDraggingPoint.left + offset, thumbDraggingPoint.right + offset]) {
        index += 1;
        const _index = index === 0 ? 1 : 0;
        if (v < min) {
          value[index] = min;
          value[_index] = min + Math.abs(thumbDraggingPoint.left - thumbDraggingPoint.right);
          break;
        }
        if (v > max) {
          value[index] = max;
          value[_index] = max - Math.abs(thumbDraggingPoint.left - thumbDraggingPoint.right);
          break;
        }
        value[index] = v;
      }

      changeValue(value);
    }
  };

  const startDrag = (e: { clientX: number; clientY: number }) => {
    const handle = (isLeft = true) => {
      const el = isLeft ? dotLeftRef.current : dotRightRef.current;
      if (el) {
        handleMove(e, isLeft);
        setDotDraggable(isLeft ? 'left' : 'right');
        (el.firstElementChild as HTMLElement).focus({ preventScroll: true });
      }
    };
    if (range) {
      if (dotLeftRef.current && dotRightRef.current) {
        const rectLeft = dotLeftRef.current.getBoundingClientRect();
        const rectRight = dotRightRef.current.getBoundingClientRect();
        const offsetLeft = vertical
          ? Math.abs(rectLeft.bottom - rectLeft.height / 2 - e.clientY)
          : Math.abs(e.clientX - (rectLeft.left + rectLeft.width / 2));
        const offsetRight = vertical
          ? Math.abs(rectRight.bottom - rectRight.height / 2 - e.clientY)
          : Math.abs(e.clientX - (rectRight.left + rectRight.width / 2));

        if (
          rangeThumbDraggable &&
          (vertical ? e.clientY < Math.max(rectLeft.top, rectRight.top) : e.clientX > Math.min(rectLeft.right, rectRight.right)) &&
          (vertical ? e.clientY > Math.min(rectLeft.bottom, rectRight.bottom) : e.clientX < Math.max(rectLeft.left, rectRight.left))
        ) {
          setThumbDraggingPoint({ left: valueLeft, right: valueRight, clientX: e.clientX, clientY: e.clientY });
        } else {
          if (offsetRight <= offsetLeft) {
            handle(false);
          } else {
            handle(true);
          }
        }
      }
    } else {
      handle(true);
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (thumbDraggingPoint) {
      tooltipLeftRef.current?.updatePosition();
      tooltipRightRef.current?.updatePosition();
    } else {
      if (dotFocused === 'left') {
        tooltipLeftRef.current?.updatePosition();
      } else if (dotFocused === 'right') {
        tooltipRightRef.current?.updatePosition();
      }
    }
  }, [value, dotFocused, thumbDraggingPoint]);

  const listenDragEvent = !isNull(dotDraggable) || !isNull(thumbDraggingPoint);

  useEvent<TouchEvent>(
    windowRef,
    'touchmove',
    (e) => {
      if (!isNull(dotDraggable)) {
        e.preventDefault();

        handleMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
      if (!isNull(thumbDraggingPoint)) {
        e.preventDefault();

        handleThumbMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    },
    { passive: false },
    !listenDragEvent,
  );
  useEvent<MouseEvent>(
    windowRef,
    'mousemove',
    (e) => {
      if (!isNull(dotDraggable)) {
        e.preventDefault();

        handleMove({ clientX: e.clientX, clientY: e.clientY });
      }
      if (!isNull(thumbDraggingPoint)) {
        e.preventDefault();

        handleThumbMove({ clientX: e.clientX, clientY: e.clientY });
      }
    },
    {},
    !listenDragEvent,
  );
  useEvent(
    windowRef,
    'mouseup',
    () => {
      setDotDraggable(null);
      setThumbDraggingPoint(null);
    },
    {},
    !listenDragEvent,
  );

  const markNodes = (() => {
    const nodes: React.ReactNode[] = [];
    const getNode = (value: number, label: React.ReactNode = null) => {
      let percentage = (value / (max - min)) * 100;
      if (reverse) {
        percentage = 100 - percentage;
      }
      nodes.push(
        <div
          {...mergeCS(
            styled('slider__mark', {
              'slider__mark--hidden': value === min || value === max,
            }),
            {
              style: {
                left: vertical ? undefined : `${percentage}%`,
                bottom: vertical ? `${percentage}%` : undefined,
              },
            },
          )}
          key={value}
        >
          {label && (
            <div
              {...styled('slider__mark-label', {
                'slider__mark-label.is-active': range
                  ? value <= Math.max(valueLeft, valueRight) && value >= Math.min(valueLeft, valueRight)
                  : value <= valueLeft,
              })}
              key={value}
            >
              {label}
            </div>
          )}
        </div>,
      );
    };
    if (isArray(marks)) {
      marks.forEach((mark) => {
        const value = isNumber(mark) ? mark : mark.value;
        getNode(value, isNumber(mark) ? null : mark.label);
      });
    } else if (isNumber(marks)) {
      for (let index = 0; index < (max - min) / marks; index++) {
        const value = index * marks;
        getNode(value);
      }
    }

    return nodes;
  })();

  const getDotNode = (isLeft: boolean) => {
    const index = isLeft ? 0 : 1;
    const value = isLeft ? valueLeft : valueRight;

    return (
      <Tooltip
        ref={(instance) => {
          const tooltipRef = isLeft ? tooltipLeftRef : tooltipRightRef;
          tooltipRef.current = instance;
          return () => {
            tooltipRef.current = null;
          };
        }}
        visible={isLeft ? visibleLeft : visibleRight}
        title={customTooltip ? customTooltip(value) : value}
        placement={vertical ? 'right' : 'top'}
        onVisibleChange={(visible) => {
          setDotVisible(visible ? (isLeft ? 'left' : 'right') : null);
        }}
      >
        {(tooltipProps) => (
          <div
            {...mergeCS(styled('slider__input-wrapper'), {
              style: {
                left: vertical ? undefined : `calc(${value} / ${max - min} * 100% - 7px)`,
                bottom: vertical ? `calc(${value} / ${max - min} * 100% - 7px)` : undefined,
              },
            })}
            ref={(instance) => {
              const dotRef = isLeft ? dotLeftRef : dotRightRef;
              dotRef.current = instance;
              return () => {
                dotRef.current = null;
              };
            }}
            {...tooltipProps}
          >
            <input
              {...inputProps?.[index]}
              {...styled('slider__input')}
              {...formControl?.inputAria}
              type="range"
              value={value}
              max={max}
              min={min}
              step={step ?? undefined}
              disabled={disabled}
              aria-orientation={vertical ? 'vertical' : 'horizontal'}
              onChange={(e) => {
                const val = toNumber(e.currentTarget.value);
                if (range) {
                  const index = isLeft ? 0 : 1;
                  changeValue((draft: any) => {
                    const offset = val - draft[index];
                    const isAdd = offset > 0;
                    draft[index] = val;
                    if (isNumber(rangeMinDistance) && draft[1] - draft[0] < rangeMinDistance) {
                      const _index = isLeft ? 1 : 0;
                      draft[_index] = getValue(draft[_index] + offset, isAdd ? 'ceil' : 'floor');
                      if (draft[1] - draft[0] < rangeMinDistance) {
                        draft[index] = getValue(draft[_index] + (isAdd ? -rangeMinDistance : rangeMinDistance), isAdd ? 'floor' : 'ceil');
                      }
                    }
                  });
                } else {
                  changeValue(val);
                }
              }}
              onFocus={(e) => {
                inputProps?.[index]?.onFocus?.(e);

                setDotFocused(isLeft ? 'left' : 'right');
              }}
              onBlur={(e) => {
                inputProps?.[index]?.onBlur?.(e);

                setDotFocused(null);
              }}
            />
          </div>
        )}
      </Tooltip>
    );
  };

  const preventBlur: React.MouseEventHandler = (e) => {
    if (e.button === 0) {
      e.preventDefault();
    }
  };

  const designProps = useDesign({ form: formControl });

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('slider', `slider--${vertical ? 'vertical' : 'horizontal'}`, {
          'slider.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
      ref={(instance) => {
        sliderRef.current = instance;
        return () => {
          sliderRef.current = null;
        };
      }}
      onMouseDown={(e) => {
        restProps.onMouseDown?.(e);

        preventBlur(e);
        if (e.button === 0) {
          startDrag(e);
        }
      }}
      onMouseUp={(e) => {
        restProps.onMouseUp?.(e);

        preventBlur(e);
      }}
      onTouchStart={(e) => {
        restProps.onTouchStart?.(e);

        startDrag({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }}
      onTouchEnd={(e) => {
        restProps.onTouchEnd?.(e);

        setDotDraggable(null);
        setThumbDraggingPoint(null);
      }}
    >
      <div
        {...styled('slider__track', {
          'slider__track--reverse': reverse,
        })}
      >
        <div
          {...mergeCS(
            styled('slider__thumb', {
              'slider__thumb.is-focused': thumbDraggingPoint,
              'slider__thumb--draggable': rangeThumbDraggable,
            }),
            {
              style: vertical
                ? {
                    bottom: `calc(${Math.min(valueLeft, valueRight)} / ${max - min} * 100%)`,
                    top: `calc(${max - Math.max(valueLeft, valueRight)} / ${max - min} * 100%)`,
                  }
                : {
                    left: `calc(${Math.min(valueLeft, valueRight)} / ${max - min} * 100%)`,
                    right: `calc(${max - Math.max(valueLeft, valueRight)} / ${max - min} * 100%)`,
                  },
            },
          )}
        />
        {getDotNode(true)}
        {range && getDotNode(false)}
      </div>
      {markNodes}
    </div>
  );
}
