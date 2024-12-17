import { isNull, isString, isUndefined } from 'lodash';
import { useMemo } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type RefExtra<T = HTMLElement> = (() => T | null) | string;

class Ref {
  private _current: any = null;

  public refExtra?: RefExtra<any>;

  public get current(): string {
    if (isNull(this._current)) {
      this.getCurrent();
    }
    return this._current;
  }

  public getCurrent() {
    if (!isUndefined(this.refExtra)) {
      this._current = isString(this.refExtra) ? document.querySelector(this.refExtra) : this.refExtra();
    } else {
      this._current = null;
    }
  }
}

export function useRefExtra(refExtra?: string): React.RefObject<HTMLElement | null>;
export function useRefExtra<T = HTMLElement>(refExtra?: () => T | null): React.RefObject<T | null>;
export function useRefExtra<T = HTMLElement>(refExtra?: RefExtra<T>): React.RefObject<T | null>;
export function useRefExtra(refExtra?: RefExtra<any>): React.RefObject<any> {
  const ref = useMemo(() => new Ref(), []);
  ref.refExtra = refExtra;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useIsomorphicLayoutEffect(() => {
    ref.getCurrent();
  });

  return ref;
}
