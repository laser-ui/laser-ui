import type { ImagePreviewProps } from './types';

import { useEvent, useImmer, useRefExtra } from '@laser-ui/hooks';
import { ReactComponent as CloseOutlined } from '@material-design-icons/svg/outlined/close.svg';
import { ReactComponent as KeyboardArrowLeftOutlined } from '@material-design-icons/svg/outlined/keyboard_arrow_left.svg';
import { ReactComponent as KeyboardArrowRightOutlined } from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg';
import { ReactComponent as Rotate90DegreesCwOutlined } from '@material-design-icons/svg/outlined/rotate_90_degrees_cw.svg';
import { ReactComponent as ZoomInOutlined } from '@material-design-icons/svg/outlined/zoom_in.svg';
import { ReactComponent as ZoomOutOutlined } from '@material-design-icons/svg/outlined/zoom_out.svg';
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

export function ImagePreview(props: ImagePreviewProps): JSX.Element | null {
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
    prevActiveEl: HTMLElement | null;
    eventData: {
      initMove?: { x: number; y: number };
      currentMove?: { x: number; y: number };
      initScale?: { x0: number; y0: number; x1: number; y1: number };
      currentScale?: { x0: number; y0: number; x1: number; y1: number };
    };
  }>({
    prevActiveEl: null,
    eventData: {},
  });

  const [active, changeActive] = useControlled<number>(defaultActive ?? 0, activeProp, onActiveChange);

  const activeSrc = list[active].src as string;

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

  const [position, setPosition] = useImmer(new Map<string, { top: number; left: number }>());
  const activePosition = position.get(activeSrc) ?? { top: 0, left: 0 };

  const [rotate, setRotate] = useImmer(new Map<string, number>());
  const activeRotate = rotate.get(activeSrc) ?? 0;

  const [scale, setScale] = useImmer(new Map<string, number>());
  const activeScale = scale.get(activeSrc) ?? 1;

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  useLockScroll(visible);

  const handleMove = () => {
    const { initMove, currentMove, initScale, currentScale } = dataRef.current.eventData;
    if (initMove && currentMove) {
      const movementX = currentMove.x - initMove.x;
      const movementY = currentMove.y - initMove.y;
      setPosition((draft) => {
        const oldPosition = draft.get(activeSrc) ?? { top: 0, left: 0 };
        draft.set(activeSrc, {
          top: oldPosition.top + movementY,
          left: oldPosition.left + movementX,
        });
      });

      dataRef.current.eventData.initMove = currentMove;
      dataRef.current.eventData.currentMove = undefined;
    }

    if (initScale && currentScale) {
      const initLength = Math.sqrt(Math.pow(initScale.x0 - initScale.x1, 2) + Math.pow(initScale.y0 - initScale.y1, 2));
      const currentLength = Math.sqrt(Math.pow(currentScale.x0 - currentScale.x1, 2) + Math.pow(currentScale.y0 - currentScale.y1, 2));
      setScale((draft) => {
        const oldScale = draft.get(activeSrc) ?? 1;
        draft.set(activeSrc, Math.max(oldScale + (currentLength - initLength) / 100, 1));
      });

      dataRef.current.eventData.initScale = currentScale;
      dataRef.current.eventData.currentScale = undefined;
    }
  };

  useEvent<TouchEvent>(
    windowRef,
    'touchmove',
    (e) => {
      e.preventDefault();

      if (e.touches.length === 2) {
        dataRef.current.eventData.initMove = dataRef.current.eventData.currentMove = undefined;

        const newScale = {
          x0: e.touches[0].clientX,
          y0: e.touches[0].clientY,
          x1: e.touches[1].clientX,
          y1: e.touches[1].clientY,
        };
        if (isUndefined(dataRef.current.eventData.initScale)) {
          dataRef.current.eventData.initScale = newScale;
        } else {
          dataRef.current.eventData.currentScale = newScale;
        }
      } else {
        dataRef.current.eventData.initScale = dataRef.current.eventData.currentScale = undefined;

        const newMove = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        if (isUndefined(dataRef.current.eventData.initMove)) {
          dataRef.current.eventData.initMove = newMove;
        } else {
          dataRef.current.eventData.currentMove = newMove;
        }
      }

      handleMove();
    },
    { passive: false },
    !listenDragEvent,
  );

  useEvent<MouseEvent>(
    windowRef,
    'mousemove',
    (e) => {
      e.preventDefault();

      const newMove = {
        x: e.clientX,
        y: e.clientY,
      };
      if (isUndefined(dataRef.current.eventData.initMove)) {
        dataRef.current.eventData.initMove = newMove;
      } else {
        dataRef.current.eventData.currentMove = newMove;
      }

      handleMove();
    },
    {},
    !listenDragEvent,
  );

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
                      setRotate((draft) => {
                        const oldRotate = draft.get(activeSrc) ?? 0;
                        draft.set(activeSrc, oldRotate + 90);
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
                      setScale((draft) => {
                        const oldScale = draft.get(activeSrc) ?? 1;
                        draft.set(activeSrc, Math.max(oldScale / 1.3, 1));
                      });
                    }}
                  />
                </li>
                <li {...styled('image-preview__toolbar-zoom')}>
                  <Input.Number
                    {...styled('image-preview__toolbar-zoom-input')}
                    model={Math.round(activeScale * 100)}
                    min={100}
                    step={10}
                    integer
                    onModelChange={(val) => {
                      if (!isNull(val)) {
                        setScale((draft) => {
                          draft.set(activeSrc, val / 100);
                        });
                      }
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
                      setScale((draft) => {
                        const oldScale = draft.get(activeSrc) ?? 1;
                        draft.set(activeSrc, oldScale * 1.3);
                      });
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
              <img
                {...list[active]}
                {...mergeCS(styled('image-preview__img'), {
                  style: {
                    transform: `translate(${activePosition.left}px, ${activePosition.top}px) rotate(${activeRotate}deg) scale(${activeScale})`,
                  },
                })}
                tabIndex={-1}
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
                  setIsDragging(true);
                }}
                onTouchEnd={() => {
                  setIsDragging(false);
                }}
                onWheel={(e) => {
                  setScale((draft) => {
                    const oldScale = draft.get(activeSrc) ?? 1;
                    draft.set(activeSrc, e.deltaY < 0 ? oldScale + 0.1 : Math.max(oldScale - 0.1, 1));
                  });
                }}
              />
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
