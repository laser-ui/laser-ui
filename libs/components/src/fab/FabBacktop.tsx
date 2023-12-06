import type { FabBacktopProps, FabButtonProps } from './types';
import type { TransitionState } from '../internal/transition/types';

import { useEvent, useIsomorphicLayoutEffect, useRefExtra, useResize } from '@laser-ui/hooks';
import { scrollTo, toPx } from '@laser-ui/utils';
import VerticalAlignTopOutlined from '@material-design-icons/svg/outlined/vertical_align_top.svg?react';
import { isString } from 'lodash';
import { cloneElement, useRef, useState } from 'react';

import { FabButton } from './FabButton';
import { useComponentProps, useLayout, useListenGlobalScrolling } from '../hooks';
import { Icon } from '../icon';
import { Transition } from '../internal/transition';
import { TTANSITION_DURING_BASE } from '../vars';

export function FabBacktop(props: FabBacktopProps): JSX.Element | null {
  const {
    children,
    page,
    distance: distanceProp = 400,
    scrollBehavior = 'instant',

    ...restProps
  } = useComponentProps('FabBacktop', props);

  const { pageScrollRef, contentResizeRef } = useLayout();

  const pageRef = useRefExtra(page ?? (() => pageScrollRef.current));

  const dataRef = useRef<{
    clearTid?: () => void;
  }>({});

  const [visible, setVisible] = useState(false);

  const transitionStyles: Partial<Record<TransitionState, React.CSSProperties>> = {
    enter: { opacity: 0 },
    entering: {
      transition: ['opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms linear`).join(', '),
    },
    leaving: {
      opacity: 0,
      transition: ['opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms linear`).join(', '),
    },
    leaved: { display: 'none' },
  };

  const updateBackTop = () => {
    if (pageRef.current) {
      const distance = isString(distanceProp) ? toPx(distanceProp, true) : distanceProp;
      setVisible(Math.ceil(pageRef.current.scrollTop) >= distance);
    }
  };
  useIsomorphicLayoutEffect(() => {
    updateBackTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listenGlobalScrolling = useListenGlobalScrolling(updateBackTop);
  useEvent(pageRef, 'scroll', updateBackTop, { passive: true }, listenGlobalScrolling);

  useResize(contentResizeRef, updateBackTop);

  const node = (
    <FabButton {...restProps}>
      {children ?? (
        <Icon>
          <VerticalAlignTopOutlined />
        </Icon>
      )}
    </FabButton>
  );

  return (
    <Transition enter={visible} during={TTANSITION_DURING_BASE}>
      {(state) =>
        cloneElement<FabButtonProps>(node, {
          style: {
            ...node.props.style,
            ...transitionStyles[state],
          },
          onClick: (e) => {
            node.props.onClick?.(e);

            if (pageRef.current) {
              dataRef.current.clearTid?.();
              dataRef.current.clearTid = scrollTo(pageRef.current, {
                top: 0,
                behavior: scrollBehavior,
              });
            }
          },
        })
      }
    </Transition>
  );
}
