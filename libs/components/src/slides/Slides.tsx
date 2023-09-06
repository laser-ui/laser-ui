import type { SlidesAutoplayOptions, SlidesItem, SlidesPaginationOptions, SlidesProps } from './types';

import { useAsync, useEvent, useRefExtra } from '@laser-ui/hooks';
import { ReactComponent as KeyboardArrowLeftOutlined } from '@material-design-icons/svg/outlined/keyboard_arrow_left.svg';
import { ReactComponent as KeyboardArrowRightOutlined } from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg';
import { isBoolean, isNumber, isUndefined, nth } from 'lodash';
import { useEffect, useId, useRef, useState } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useNamespace, useStyled } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function Slides<ID extends React.Key, T extends SlidesItem<ID>>(props: SlidesProps<ID, T>): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    active: activeProp,
    defaultActive,
    autoplay: autoplayProp = 0,
    arrow = 'hover',
    pagination: paginationProp = true,
    vertical = false,
    effect = 'slide',
    onActiveChange,

    ...restProps
  } = useComponentProps('Slides', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { slides: styleProvider?.slides }, styleOverrides);

  const async = useAsync();

  const slidesRef = useRef<HTMLDivElement>(null);
  const windowRef = useRefExtra(() => window);

  const uniqueId = useId();
  const viewId = `${namespace}-slides-view-${uniqueId}`;

  const dataRef = useRef<{
    startDragTime: number;
    clearTid?: () => void;
  }>({
    startDragTime: 0,
  });

  const autoplay = Object.assign<SlidesAutoplayOptions, SlidesAutoplayOptions>(
    { delay: 0, stopOnLast: false, pauseOnMouseEnter: true },
    isNumber(autoplayProp) ? { delay: autoplayProp } : autoplayProp,
  );
  const pagination = Object.assign<SlidesPaginationOptions, SlidesPaginationOptions>(
    { visible: true, dynamic: false },
    isBoolean(paginationProp) ? { visible: paginationProp } : paginationProp === 'hover' ? { visible: 'hover' } : paginationProp,
  );

  const [active, changeActive] = useControlled<ID | null, ID>(defaultActive ?? nth(list, 0)?.id ?? null, activeProp, (id) => {
    if (onActiveChange) {
      onActiveChange(id, list.find((s) => s.id === id) as T);
    }
  });
  const activeIndex = list.findIndex((s) => s.id === active);

  const [mouseEnter, setMouseEnter] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<number>();
  const [dragDistance, setDragDistance] = useState(0);
  const [dragOpacity, setDragOpacity] = useState<{ index: number; value: number }>();
  const listenDragEvent = !isUndefined(dragStartPosition);
  const changeDragDistance = (distance: number) => {
    if (slidesRef.current) {
      const els: HTMLDivElement[] = [];
      const slideEls = slidesRef.current.querySelectorAll(`.${namespace}-slides__slide`);
      slideEls.forEach((el) => {
        const index = Number((el as HTMLDivElement).dataset['index']);
        els[index] = el as HTMLDivElement;
      });

      if (distance > 0) {
        let size = 0;
        for (let index = activeIndex - 1; index >= 0; index--) {
          size += els[index][vertical ? 'offsetHeight' : 'offsetWidth'];
        }
        const distanceValue =
          Math.abs(distance) > size
            ? size +
              Math.sin(Math.min((Math.abs(distance) - size) / (els[0][vertical ? 'offsetHeight' : 'offsetWidth'] * 3), 1) * (Math.PI / 2)) *
                els[0][vertical ? 'offsetHeight' : 'offsetWidth']
            : distance;
        setDragDistance(distanceValue);
        setDragOpacity({
          index: activeIndex,
          value:
            activeIndex === 0
              ? 1
              : Math.max(1 - Math.abs(distanceValue) / els[activeIndex - 1][vertical ? 'offsetHeight' : 'offsetWidth'], 0),
        });
      } else {
        let size = 0;
        for (let index = activeIndex + 1; index < list.length; index++) {
          size += els[index][vertical ? 'offsetHeight' : 'offsetWidth'];
        }
        const distanceValue =
          Math.abs(distance) > size
            ? -(
                size +
                Math.sin(
                  Math.min((Math.abs(distance) - size) / (els[list.length - 1][vertical ? 'offsetHeight' : 'offsetWidth'] * 3), 1) *
                    (Math.PI / 2),
                ) *
                  els[list.length - 1][vertical ? 'offsetHeight' : 'offsetWidth']
              )
            : distance;
        setDragDistance(distanceValue);
        setDragOpacity({
          index: Math.min(activeIndex + 1, list.length - 1),
          value:
            activeIndex === list.length - 1
              ? 1
              : Math.min(Math.abs(distanceValue) / els[activeIndex + 1][vertical ? 'offsetHeight' : 'offsetWidth'], 1),
        });
      }
    }
  };
  const handleDragEnd = () => {
    if (slidesRef.current) {
      const els: HTMLDivElement[] = [];
      const slideEls = slidesRef.current.querySelectorAll(`.${namespace}-slides__slide`);
      slideEls.forEach((el) => {
        const index = Number((el as HTMLDivElement).dataset['index']);
        els[index] = el as HTMLDivElement;
      });

      if (dragDistance > 0) {
        let newIndex = activeIndex;
        let size = 0;
        for (let index = activeIndex - 1; index >= 0; index--) {
          if (Math.abs(dragDistance) > size + els[index][vertical ? 'offsetHeight' : 'offsetWidth'] / 2) {
            size += els[index][vertical ? 'offsetHeight' : 'offsetWidth'];
            newIndex = index;
          } else {
            break;
          }
        }
        if (newIndex === activeIndex) {
          if (performance.now() - dataRef.current.startDragTime < 300 && Math.abs(dragDistance) > 30) {
            const id = nth(list, Math.max(newIndex - 1, 0))?.id;
            if (!isUndefined(id)) {
              changeActive(id);
            }
          }
        } else {
          const id = nth(list, newIndex)?.id;
          if (!isUndefined(id)) {
            changeActive(id);
          }
        }
      } else {
        let newIndex = activeIndex;
        let size = 0;
        for (let index = activeIndex + 1; index < list.length; index++) {
          if (Math.abs(dragDistance) > size + els[index][vertical ? 'offsetHeight' : 'offsetWidth'] / 2) {
            size += els[index][vertical ? 'offsetHeight' : 'offsetWidth'];
            newIndex = index;
          } else {
            break;
          }
        }
        if (newIndex === activeIndex) {
          if (performance.now() - dataRef.current.startDragTime < 300 && Math.abs(dragDistance) > 30) {
            const id = nth(list, Math.min(newIndex + 1, list.length - 1))?.id;
            if (!isUndefined(id)) {
              changeActive(id);
            }
          }
        } else {
          const id = nth(list, newIndex)?.id;
          if (!isUndefined(id)) {
            changeActive(id);
          }
        }
      }
    }
    setDragStartPosition(undefined);
    setDragDistance(0);
    setDragOpacity(undefined);
  };

  useEffect(() => {
    if (slidesRef.current) {
      let size = 0;
      const slideEls = slidesRef.current.querySelectorAll(`.${namespace}-slides__slide`);
      slideEls.forEach((el) => {
        const index = Number((el as HTMLDivElement).dataset['index']);
        if (index < activeIndex) {
          size += (el as HTMLDivElement)[vertical ? 'offsetHeight' : 'offsetWidth'];
        } else if (index === activeIndex) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          slidesRef.current!.style.height = (el as HTMLDivElement).offsetHeight + 'px';
        }
      });

      const containerEl = slidesRef.current.querySelector(`.${namespace}-slides__container`) as HTMLDivElement;
      containerEl.style.transform = effect === 'slide' ? `translate${vertical ? 'Y' : 'X'}(calc(-${size}px + ${dragDistance}px))` : '';
    }
  });

  useEffect(() => {
    if (
      autoplay.delay === 0 ||
      (autoplay.stopOnLast && activeIndex === list.length - 1) ||
      (autoplay.pauseOnMouseEnter && mouseEnter) ||
      listenDragEvent
    ) {
      dataRef.current.clearTid?.();
      dataRef.current.clearTid = undefined;
    } else if (isUndefined(dataRef.current.clearTid)) {
      dataRef.current.clearTid = async.setTimeout(
        () => {
          dataRef.current.clearTid = undefined;
          const id = nth(list, (activeIndex + 1) % list.length)?.id;
          if (!isUndefined(id)) {
            changeActive(id);
          }
        },
        autoplay.delay,
        () => {
          dataRef.current.clearTid = undefined;
        },
      );
    }
  });

  useEvent<TouchEvent>(
    windowRef,
    'touchmove',
    (e) => {
      if (listenDragEvent) {
        e.preventDefault();

        changeDragDistance(e.touches[0][vertical ? 'clientY' : 'clientX'] - dragStartPosition);
      }
    },
    { passive: false },
    !listenDragEvent,
  );
  useEvent<MouseEvent>(
    windowRef,
    'mousemove',
    (e) => {
      if (listenDragEvent) {
        e.preventDefault();

        changeDragDistance(e[vertical ? 'clientY' : 'clientX'] - dragStartPosition);
      }
    },
    {},
    !listenDragEvent,
  );
  useEvent(
    windowRef,
    'mouseup',
    () => {
      handleDragEnd();
    },
    {},
    !listenDragEvent,
  );

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('slides', {
          'slides--vertical': vertical,
          'slides--fade': effect === 'fade',
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={slidesRef}
      onMouseEnter={(e) => {
        restProps.onMouseEnter?.(e);

        setMouseEnter(true);
      }}
      onMouseLeave={(e) => {
        restProps.onMouseLeave?.(e);

        setMouseEnter(false);
      }}
    >
      <div
        {...mergeCS(styled('slides__container'), {
          style: { transition: listenDragEvent ? 'none' : undefined },
        })}
        id={viewId}
        role="region"
        aria-live="polite"
        onMouseDown={(e) => {
          e.preventDefault();

          if (e.button === 0) {
            setDragStartPosition(e[vertical ? 'clientY' : 'clientX']);
            dataRef.current.startDragTime = performance.now();
          }
        }}
        onTouchStart={(e) => {
          setDragStartPosition(e.touches[0][vertical ? 'clientY' : 'clientX']);
          dataRef.current.startDragTime = performance.now();
        }}
        onTouchEnd={() => {
          handleDragEnd();
        }}
      >
        {list.map((slide, index) => {
          let opacity = index <= activeIndex ? 1 : 0;
          if (listenDragEvent && dragOpacity && dragOpacity.index === index) {
            opacity = dragOpacity.value;
          }

          return (
            <div
              {...mergeCS(styled('slides__slide'), {
                style: effect === 'slide' ? undefined : { opacity, transition: listenDragEvent ? 'none' : undefined },
              })}
              key={slide.id}
              aria-hidden={slide.id !== active}
              data-index={index}
            >
              {slide.content}
            </div>
          );
        })}
      </div>
      {(arrow === true || arrow === 'hover') && (
        <>
          <button
            {...styled('slides__arrow', 'slides__arrow--prev', {
              'slides__arrow.is-hidden': arrow === 'hover' && !mouseEnter,
            })}
            tabIndex={-1}
            disabled={activeIndex === 0}
            onClick={() => {
              const id = nth(list, activeIndex - 1)?.id;
              if (!isUndefined(id)) {
                changeActive(id);
              }
            }}
          >
            <Icon>
              <KeyboardArrowLeftOutlined />
            </Icon>
          </button>
          <button
            {...styled('slides__arrow', 'slides__arrow--next', {
              'slides__arrow.is-hidden': arrow === 'hover' && !mouseEnter,
            })}
            tabIndex={-1}
            disabled={activeIndex === list.length - 1}
            onClick={() => {
              const id = nth(list, activeIndex + 1)?.id;
              if (!isUndefined(id)) {
                changeActive(id);
              }
            }}
          >
            <Icon>
              <KeyboardArrowRightOutlined />
            </Icon>
          </button>
        </>
      )}
      {(pagination.visible === true || pagination.visible === 'hover') && (
        <div
          {...styled('slides__pagination', {
            'slides__pagination.is-hidden': pagination.visible === 'hover' && !mouseEnter,
            'slides__pagination--dynamic': pagination.dynamic,
          })}
          role="radiogroup"
        >
          {list.map((slide, index) => {
            const checked = active === slide.id;

            return (
              <input
                {...mergeCS(
                  styled('slides__pagination-radio', {
                    'slides__pagination-radio.is-checked': checked,
                    'slides__pagination-radio--prev-1': pagination.dynamic && index - activeIndex === -1,
                    'slides__pagination-radio--prev-2': pagination.dynamic && index - activeIndex === -2,
                    'slides__pagination-radio--next-1': pagination.dynamic && index - activeIndex === 1,
                    'slides__pagination-radio--next-2': pagination.dynamic && index - activeIndex === 2,
                  }),
                  {
                    style: { [vertical ? 'top' : 'left']: pagination.dynamic ? 40 - 8 - 16 * activeIndex : undefined },
                  },
                )}
                key={slide.id}
                type="radio"
                value={slide.id}
                checked={checked}
                name={uniqueId}
                title={slide.tooltip}
                aria-checked={checked}
                aria-controls={viewId}
                onChange={() => {
                  changeActive(slide.id);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
