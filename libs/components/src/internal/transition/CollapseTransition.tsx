import type { CollapseTransitionProps } from './types';

import { isNumber, isUndefined } from 'lodash';
import { useRef } from 'react';

import { Transition } from './Transition';

export function CollapseTransition(props: CollapseTransitionProps): JSX.Element | null {
  const {
    children,
    originalSize: originalSizeProp,
    collapsedSize,
    styles,

    ...restProps
  } = props;

  const dataRef = useRef<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const elRef = useRef<HTMLElement>(null);

  const isHorizontal = !isUndefined(originalSizeProp.width);

  const getSizeStyle = (val: string | number | undefined) => (isUndefined(val) ? '' : isNumber(val) ? `${val}px` : val);

  return (
    <Transition
      {...restProps}
      afterRender={() => {
        restProps.afterRender?.();

        if (elRef.current) {
          if (originalSizeProp.width === 'auto') {
            const cssText = elRef.current.style.cssText;
            elRef.current.style.width = 'auto';
            elRef.current.style.paddingLeft = getSizeStyle(originalSizeProp.padding?.[3]);
            elRef.current.style.paddingRight = getSizeStyle(originalSizeProp.padding?.[1]);
            dataRef.current.width = elRef.current.offsetWidth;
            elRef.current.style.cssText = cssText;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            elRef.current.offsetTop;
          } else if (originalSizeProp.height === 'auto') {
            const cssText = elRef.current.style.cssText;
            elRef.current.style.height = 'auto';
            elRef.current.style.paddingTop = getSizeStyle(originalSizeProp.padding?.[0]);
            elRef.current.style.paddingBottom = getSizeStyle(originalSizeProp.padding?.[2]);
            dataRef.current.height = elRef.current.offsetHeight;
            elRef.current.style.cssText = cssText;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            elRef.current.offsetTop;
          }
        }
      }}
    >
      {(state) => {
        const transitionStyle: React.CSSProperties = Object.assign({}, styles[state]);

        const originalSize: React.CSSProperties = {
          [isHorizontal ? 'width' : 'height']: isHorizontal
            ? originalSizeProp.width === 'auto'
              ? dataRef.current.width
              : originalSizeProp.width
            : originalSizeProp.height === 'auto'
              ? dataRef.current.height
              : originalSizeProp.height,
        };
        if (!isUndefined(originalSizeProp.padding)) {
          originalSize.padding = originalSizeProp.padding.map((p) => getSizeStyle(p)).join(' ');
        }

        const collapsedStyle: React.CSSProperties = Object.assign(
          {
            [isHorizontal ? 'width' : 'height']: collapsedSize[isHorizontal ? 'width' : 'height'],
            overflow: 'hidden',
          },
          isHorizontal
            ? {
                paddingLeft: collapsedSize.padding?.[3] ?? 0,
                paddingRight: collapsedSize.padding?.[1] ?? 0,
                marginLeft: collapsedSize.margin?.[3] ?? 0,
                marginRight: collapsedSize.margin?.[1] ?? 0,
              }
            : {
                paddingTop: collapsedSize.padding?.[0] ?? 0,
                paddingBottom: collapsedSize.padding?.[2] ?? 0,
                marginTop: collapsedSize.margin?.[0] ?? 0,
                marginBottom: collapsedSize.margin?.[2] ?? 0,
              },
        );

        switch (state) {
          case 'enter':
            Object.assign(transitionStyle, collapsedStyle);
            break;

          case 'entering':
            Object.assign(transitionStyle, originalSize, {
              overflow: 'hidden',
            });
            break;

          case 'leave':
            if (elRef.current) {
              originalSize[isHorizontal ? 'width' : 'height'] = elRef.current[isHorizontal ? 'offsetWidth' : 'offsetHeight'];
            }
            Object.assign(transitionStyle, originalSize, {
              overflow: 'hidden',
            });
            break;

          case 'leaving':
            Object.assign(transitionStyle, collapsedStyle);
            break;

          case 'leaved':
            Object.assign(transitionStyle, collapsedStyle, {
              overflow: 'hidden',
            });
            break;

          default:
            break;
        }

        return children(elRef, transitionStyle, state);
      }}
    </Transition>
  );
}
