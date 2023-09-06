import type { TransitionProps, TransitionState } from './types';

import { useAsync } from '@laser-ui/hooks';
import { isArray, isBoolean, isNumber } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

export function Transition(props: TransitionProps): JSX.Element | null {
  const {
    children,
    enter: enterProp,
    defaultEnter,
    during: duringProp,
    mountBeforeFirstEnter = true,
    skipFirstTransition = true,
    destroyWhenLeaved = false,
    afterRender,
    afterEnter,
    afterLeave,
  } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initEnter = useMemo(() => (isBoolean(enterProp) ? enterProp : (defaultEnter as boolean)), []);

  const initState = useMemo<TransitionState>(() => {
    const [skipEnter, skipLeave] = isArray(skipFirstTransition) ? skipFirstTransition : [skipFirstTransition, skipFirstTransition];
    if (initEnter) {
      return skipEnter ? 'entered' : 'enter';
    } else {
      return skipLeave ? 'leaved' : 'leave';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataRef = useRef<{
    state: TransitionState;
    prevEnter: boolean;
    isFirstEnter: boolean;
    clearTid?: () => void;
  }>({
    prevEnter: initEnter,
    isFirstEnter: !initEnter,
    state: initState,
  });

  const enter = isBoolean(enterProp) ? enterProp : enterProp(dataRef.current.prevEnter);

  const async = useAsync();

  const [stateChange, setStateChange] = useState(0);

  if (dataRef.current.prevEnter !== enter) {
    dataRef.current.prevEnter = enter;

    dataRef.current.state = enter ? 'enter' : 'leave';
    dataRef.current.isFirstEnter = false;
  }

  const state = dataRef.current.state;

  const nextFrame = (cb: () => void) => {
    dataRef.current.clearTid = async.requestAnimationFrame(() => {
      dataRef.current.clearTid = async.setTimeout(cb);
    });
  };

  useEffect(() => {
    if (state === 'entered') {
      afterRender?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataRef.current.clearTid?.();
    if (state === 'enter') {
      afterRender?.();
      nextFrame(() => {
        dataRef.current.state = 'entering';
        setStateChange((prevStateChange) => prevStateChange + 1);
      });
    } else if (state === 'leave') {
      nextFrame(() => {
        dataRef.current.state = 'leaving';
        setStateChange((prevStateChange) => prevStateChange + 1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enter]);

  useEffect(() => {
    if (dataRef.current.state === 'entering' || dataRef.current.state === 'leaving') {
      const during = isNumber(duringProp) ? duringProp : enter ? duringProp.enter : duringProp.leave;
      dataRef.current.clearTid = async.setTimeout(() => {
        dataRef.current.state = enter ? 'entered' : 'leaved';
        setStateChange((prevStateChange) => prevStateChange + 1);
      }, during);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateChange]);

  useEffect(() => {
    if (dataRef.current.state === 'entered' || dataRef.current.state === 'leaved') {
      enter ? afterEnter?.() : afterLeave?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateChange]);

  const shouldRender = (() => {
    if (state === 'leaved' && destroyWhenLeaved) {
      return false;
    }

    if (dataRef.current.isFirstEnter && !mountBeforeFirstEnter) {
      return false;
    }

    return true;
  })();

  return shouldRender ? children(state) : null;
}
