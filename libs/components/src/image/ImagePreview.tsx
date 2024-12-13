import type { ImagePreviewProps } from './types';

import { useEvent, useRefExtra } from '@laser-ui/hooks';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import KeyboardArrowLeftOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_left.svg?react';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import Rotate90DegreesCwOutlined from '@material-design-icons/svg/outlined/rotate_90_degrees_cw.svg?react';
import ZoomInOutlined from '@material-design-icons/svg/outlined/zoom_in.svg?react';
import ZoomOutOutlined from '@material-design-icons/svg/outlined/zoom_out.svg?react';
import { isNull, isUndefined } from 'lodash';
import { useRef, useState } from 'react';

import { PREVIEW_CLASSES } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useLockScroll, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { Icon } from '../icon';
import { Input } from '../input';
import { Mask } from '../internal/mask';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { ROOT_DATA } from '../root/vars';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function ImagePreview(props: ImagePreviewProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    visible,
    active: activeProp,
    defaultActive,
    escClosable = true,
    zIndex: zIndexProp,
    onActiveChange,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('ImagePreview', props);

  const namespace = useNamespace();
  const styled = useStyled(PREVIEW_CLASSES, { 'image-preview': styleProvider?.['image-preview'] }, styleOverrides);

  const previewRef = useRef<HTMLDivElement>(null);
  const windowRef = useRefExtra(() => window);

  const dataRef = useRef<{
    transform: Map<number, { top: number; left: number; scale: number; rotate: number }>;
    initialScale: number;
    prevActiveEl: HTMLElement | null;
    eventData: {
      initialMove?: { x: number; y: number };
      currentMove?: { x: number; y: number };
      initialTouches?: { x0: number; y0: number; x1: number; y1: number };
      currentTouches?: { x0: number; y0: number; x1: number; y1: number };
    };
    mouse: { x: number; y: number };
  }>({
    transform: new Map(),
    initialScale: 1,
    prevActiveEl: null,
    eventData: {},
    mouse: { x: 0, y: 0 },
  });

  const [active, changeActive] = useControlled<number>(defaultActive ?? 0, activeProp, onActiveChange);

  const [offset, setOffset] = useState(() => {
    if (ROOT_DATA.windowSize.width) {
      return ~~((ROOT_DATA.windowSize.width - 108) / 120);
    }
    return 3;
  });
  useEvent(
    windowRef,
    'resize',
    () => {
      setOffset(~~((ROOT_DATA.windowSize.width - 108) / 120));
    },
    {},
    !visible,
  );

  let startIndex = Math.max(active - offset, 0);
  const endIndex = Math.min(startIndex + offset * 2, list.length - 1);
  startIndex = Math.max(endIndex - offset * 2, 0);

  const [isDragging, setIsDragging] = useState(false);
  const listenDragEvent = visible && isDragging;

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  useLockScroll(visible);

  const setTransform = (
    update: (transform: { top: number; left: number; scale: number; rotate: number }) => void,
    scaleByClick = false,
  ) => {
    const transform = dataRef.current.transform.get(active) ?? { top: 0, left: 0, scale: 1, rotate: 0 };
    const prevScale = transform.scale;
    const prevRotate = transform.rotate;
    update(transform);
    dataRef.current.transform.set(active, transform);

    if (previewRef.current) {
      const img = previewRef.current.querySelector(`[data-index="${active}"]`) as HTMLImageElement;
      const imgWrapper = img.parentElement as HTMLDivElement;
      const transform = dataRef.current.transform.get(active) ?? { top: 0, left: 0, scale: 1, rotate: 0 };
      if (transform.rotate !== prevRotate) {
        transform.top = 0;
        transform.left = 0;
        transform.scale = 1;
      } else if (transform.scale !== prevScale) {
        const rect = imgWrapper.getBoundingClientRect();
        const offsetScale = transform.scale - prevScale;
        const offsetWidth = ((scaleByClick ? window.innerWidth / 2 : dataRef.current.mouse.x) - rect.x) / prevScale;
        const offsetHeight = ((scaleByClick ? window.innerHeight / 2 : dataRef.current.mouse.y) - rect.y) / prevScale;
        transform.left = transform.left - offsetScale * offsetWidth;
        transform.top = transform.top - offsetScale * offsetHeight;
      }
      imgWrapper.style.transform = `translate(${transform.left}px, ${transform.top}px) scale(${transform.scale})`;
      img.style.transform = `rotate(${transform.rotate}deg)`;
    }
  };

  const handleMove = () => {
    const { initialMove, currentMove, initialTouches, currentTouches } = dataRef.current.eventData;
    const updates: any[] = [];
    if (initialMove && currentMove) {
      const movementX = currentMove.x - initialMove.x;
      const movementY = currentMove.y - initialMove.y;
      updates.push((transform: any) => {
        transform.top = transform.top + movementY;
        transform.left = transform.left + movementX;
      });

      dataRef.current.eventData.initialMove = currentMove;
      dataRef.current.eventData.currentMove = undefined;
    }

    if (initialTouches && currentTouches) {
      const initialLength = Math.sqrt(
        Math.pow(initialTouches.x0 - initialTouches.x1, 2) + Math.pow(initialTouches.y0 - initialTouches.y1, 2),
      );
      const currentLength = Math.sqrt(
        Math.pow(currentTouches.x0 - currentTouches.x1, 2) + Math.pow(currentTouches.y0 - currentTouches.y1, 2),
      );
      updates.push((transform: any) => {
        transform.scale = Math.max(dataRef.current.initialScale * (currentLength / initialLength), 1);
      });

      dataRef.current.eventData.currentTouches = undefined;
    }

    setTransform((transform) => {
      for (const update of updates) {
        update(transform);
      }
    });
  };

  useEvent<TouchEvent>(
    windowRef,
    'touchmove',
    (e) => {
      e.preventDefault();

      if (e.touches.length === 2) {
        dataRef.current.eventData.initialMove = dataRef.current.eventData.currentMove = undefined;

        const touches = {
          x0: e.touches[0].clientX,
          y0: e.touches[0].clientY,
          x1: e.touches[1].clientX,
          y1: e.touches[1].clientY,
        };
        if (isUndefined(dataRef.current.eventData.initialTouches)) {
          dataRef.current.eventData.initialTouches = touches;
        } else {
          dataRef.current.eventData.currentTouches = touches;
        }
      } else {
        const newMove = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        if (isUndefined(dataRef.current.eventData.initialMove)) {
          dataRef.current.eventData.initialMove = newMove;
        } else {
          dataRef.current.eventData.currentMove = newMove;
        }
      }

      handleMove();
    },
    { passive: false },
    !listenDragEvent,
  );

  useEvent<MouseEvent>(windowRef, 'mousemove', (e) => {
    const newMove = {
      x: e.clientX,
      y: e.clientY,
    };
    dataRef.current.mouse = newMove;

    if (isDragging) {
      e.preventDefault();

      if (isUndefined(dataRef.current.eventData.initialMove)) {
        dataRef.current.eventData.initialMove = newMove;
      } else {
        dataRef.current.eventData.currentMove = newMove;
      }

      handleMove();
    }
  });

  useEvent(
    windowRef,
    'mouseup',
    () => {
      setIsDragging(false);
    },
    {},
    !listenDragEvent,
  );

  return (
    <Portal
      selector={() => {
        let el = document.getElementById(`${namespace}-image-preview-root`);
        if (!el) {
          el = document.createElement('div');
          el.id = `${namespace}-image-preview-root`;
          document.body.appendChild(el);
        }
        return el;
      }}
    >
      <Transition
        enter={visible}
        during={TTANSITION_DURING_BASE}
        destroyWhenLeaved
        afterEnter={() => {
          afterVisibleChange?.(true);

          dataRef.current.prevActiveEl = document.activeElement as HTMLElement | null;
          if (previewRef.current) {
            previewRef.current.focus({ preventScroll: true });
          }
        }}
        afterLeave={() => {
          afterVisibleChange?.(false);

          if (dataRef.current.prevActiveEl) {
            dataRef.current.prevActiveEl.focus({ preventScroll: true });
          }
        }}
      >
        {(state) => {
          let transitionStyle: React.CSSProperties = {};
          switch (state) {
            case 'enter':
              transitionStyle = { transform: 'scale(0.3)', opacity: 0 };
              break;

            case 'entering':
              transitionStyle = {
                transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
              };
              break;

            case 'leaving':
              transitionStyle = {
                transform: 'scale(0.3)',
                opacity: 0,
                transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
              };
              break;

            default:
              break;
          }

          return (
            <div
              {...restProps}
              {...mergeCS(styled('image-preview'), {
                className: restProps.className,
                style: {
                  ...restProps.style,
                  ...transitionStyle,
                  display: state === 'leaved' ? 'none' : undefined,
                  zIndex,
                },
              })}
              ref={previewRef}
              tabIndex={-1}
              onKeyDown={(e) => {
                restProps.onKeyDown?.(e);

                if (visible && escClosable && e.code === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  onClose?.();
                }
              }}
            >
              <button
                {...styled('image-preview__navigation-button', 'image-preview__navigation-button--prev')}
                onClick={() => {
                  changeActive((prevActive) => {
                    return prevActive === 0 ? list.length - 1 : prevActive - 1;
                  });
                }}
              >
                <Icon>
                  <KeyboardArrowLeftOutlined />
                </Icon>
              </button>
              <button
                {...styled('image-preview__navigation-button', 'image-preview__navigation-button--next')}
                onClick={() => {
                  changeActive((prevActive) => {
                    return prevActive === list.length - 1 ? 0 : prevActive + 1;
                  });
                }}
              >
                <Icon>
                  <KeyboardArrowRightOutlined />
                </Icon>
              </button>
              <ul {...styled('image-preview__toolbar')}>
                <li {...styled('image-preview__toolbar-page')}>
                  <Input.Number
                    {...styled('image-preview__toolbar-page-input')}
                    model={active + 1}
                    min={1}
                    max={list.length}
                    integer
                    onModelChange={(val) => {
                      if (!isNull(val)) {
                        changeActive(val - 1);
                      }
                    }}
                  />
                  <span>/</span>
                  <span>{list.length}</span>
                </li>
                <li {...styled('image-preview__toolbar-rotate')}>
                  <Button
                    pattern="text"
                    icon={
                      <Icon>
                        <Rotate90DegreesCwOutlined />
                      </Icon>
                    }
                    onClick={() => {
                      setTransform((transform) => {
                        transform.rotate = transform.rotate + 90;
                      });
                    }}
                  />
                </li>
                <li {...styled('image-preview__toolbar-zoom-out')}>
                  <Button
                    pattern="text"
                    icon={
                      <Icon>
                        <ZoomOutOutlined />
                      </Icon>
                    }
                    onClick={() => {
                      setTransform((transform) => {
                        transform.scale = Math.max(transform.scale / 1.3, 1);
                      }, true);
                    }}
                  />
                </li>
                <li {...styled('image-preview__toolbar-zoom-in')}>
                  <Button
                    pattern="text"
                    icon={
                      <Icon>
                        <ZoomInOutlined />
                      </Icon>
                    }
                    onClick={() => {
                      setTransform((transform) => {
                        transform.scale = transform.scale * 1.3;
                      }, true);
                    }}
                  />
                </li>
                <li {...styled('image-preview__toolbar-close')}>
                  <Button
                    pattern="text"
                    icon={
                      <Icon>
                        <CloseOutlined />
                      </Icon>
                    }
                    onClick={() => {
                      onClose?.();
                    }}
                  />
                </li>
              </ul>
              {list.map((img, index) => (
                <div
                  key={index}
                  {...mergeCS(styled('image-preview__img-wrapper'), {
                    style: {
                      display: index === active ? undefined : 'none',
                    },
                  })}
                >
                  <img
                    {...img}
                    {...styled('image-preview__img')}
                    tabIndex={-1}
                    data-index={index}
                    onMouseDown={(e) => {
                      if (e.button === 0) {
                        e.preventDefault();

                        e.currentTarget.focus({ preventScroll: true });
                        dataRef.current.eventData = {};
                        setIsDragging(true);
                      }
                    }}
                    onMouseUp={(e) => {
                      if (e.button === 0) {
                        e.preventDefault();
                      }
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.focus({ preventScroll: true });
                      dataRef.current.eventData = {};
                      if (e.touches.length === 1) {
                        setIsDragging(true);
                      } else if (e.touches.length === 2) {
                        dataRef.current.initialScale = dataRef.current.transform.get(active)?.scale ?? 1;
                        dataRef.current.mouse = {
                          x: Math.min(e.touches[0].clientX, e.touches[1].clientX) + Math.abs(e.touches[0].clientX - e.touches[1].clientX),
                          y: Math.min(e.touches[0].clientY, e.touches[1].clientY) + Math.abs(e.touches[0].clientY - e.touches[1].clientY),
                        };
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (e.touches.length === 1) {
                        dataRef.current.eventData.initialTouches = dataRef.current.eventData.currentTouches = undefined;
                      } else {
                        setIsDragging(false);
                      }
                    }}
                    onWheel={(e) => {
                      setTransform((transform) => {
                        transform.scale =
                          e.deltaY < 0 ? transform.scale + transform.scale * 0.1 : Math.max(transform.scale - transform.scale * 0.1, 1);
                      });
                    }}
                  />
                </div>
              ))}
              <ul {...styled('image-preview__thumbnail-list')}>
                {list.map(
                  (imgProps, index) =>
                    index >= startIndex &&
                    index <= endIndex && (
                      <li
                        {...styled('image-preview__thumbnail', {
                          'image-preview__thumbnail.is-active': active === index,
                        })}
                        key={index}
                        onClick={() => {
                          changeActive(index);
                        }}
                      >
                        <img {...imgProps} {...styled('image-preview__thumbnail-img')} />
                      </li>
                    ),
                )}
              </ul>
              <Mask visible />
            </div>
          );
        }}
      </Transition>
    </Portal>
  );
}
