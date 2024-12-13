import type { FabBacktopProps } from './types';

import { useEvent, useIsomorphicLayoutEffect, useRefExtra, useResize, useUnmount } from '@laser-ui/hooks';
import { scrollTo, toPx } from '@laser-ui/utils';
import VerticalAlignTopOutlined from '@material-design-icons/svg/outlined/vertical_align_top.svg?react';
import { isString } from 'lodash';
import { useRef, useState } from 'react';

import { FabButton } from './FabButton';
import { FabBacktopContext } from './vars';
import { useComponentProps, useLayout, useNamespace } from '../hooks';
import { Icon } from '../icon';
import { Transition } from '../transition';
import { TTANSITION_DURING_BASE } from '../vars';

export function FabBacktop(props: FabBacktopProps): React.ReactElement | null {
  const {
    children,
    page,
    distance: distanceProp = 400,
    scrollBehavior = 'instant',

    ...restProps
  } = useComponentProps('FabBacktop', props);

  const namespace = useNamespace();
  const { pageScrollRef, contentResizeRef } = useLayout();

  const pageRef = useRefExtra(page ?? (() => pageScrollRef.current));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clearTid = useRef(() => {});

  const [visible, setVisible] = useState(false);

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

  useEvent(pageRef, 'scroll', updateBackTop, { passive: true });

  useResize(contentResizeRef, updateBackTop);

  useUnmount(() => {
    clearTid.current();
  });

  return (
    <Transition enter={visible} name={`${namespace}-fade`} duration={TTANSITION_DURING_BASE}>
      {(transitionRef, leaved) => (
        <FabBacktopContext
          value={{
            ref: transitionRef,
            leaved,
            onClick: () => {
              if (pageRef.current) {
                clearTid.current();
                clearTid.current = scrollTo(pageRef.current, {
                  top: 0,
                  behavior: scrollBehavior,
                });
              }
            },
          }}
        >
          <FabButton {...restProps}>
            {children ?? (
              <Icon>
                <VerticalAlignTopOutlined />
              </Icon>
            )}
          </FabButton>
        </FabBacktopContext>
      )}
    </Transition>
  );
}
