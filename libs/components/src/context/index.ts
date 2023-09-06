import type { ComponentProps } from './props';
import type { Size } from '../types';
import type { RefExtra } from '@laser-ui/hooks/useRefExtra';

import { isUndefined } from 'lodash';
import { createContext } from 'react';

interface LContextData {
  namespace: string;
  componentDisabled: boolean;
  componentSize: Size;
  componentDefaultProps: { [K in keyof ComponentProps]?: Partial<ComponentProps[K]> };
  layoutPageScrollEl: RefExtra | null;
  layoutContentResizeEl: RefExtra | null;
  listenGlobalScrolling: boolean;
}

export type LContextIn = Partial<LContextData>;

export class LContextManager {
  public namespace: LContextData['namespace'];
  public componentDisabled: LContextData['componentDisabled'];
  public componentSize: LContextData['componentSize'];
  public componentDefaultProps: LContextData['componentDefaultProps'];
  public layoutPageScrollEl: LContextData['layoutPageScrollEl'];
  public layoutContentResizeEl: LContextData['layoutContentResizeEl'];
  public listenGlobalScrolling: LContextData['listenGlobalScrolling'];

  private _parent: LContextManager | null = null;

  get parent(): LContextManager | null {
    return this._parent;
  }
  get root(): LContextManager {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let instance: LContextManager = this;

    while (instance.parent) {
      instance = instance.parent;
    }

    return instance;
  }

  constructor(context: LContextData) {
    this.namespace = context.namespace;
    this.componentDisabled = context.componentDisabled;
    this.componentSize = context.componentSize;
    this.componentDefaultProps = context.componentDefaultProps;
    this.layoutPageScrollEl = context.layoutPageScrollEl;
    this.layoutContentResizeEl = context.layoutContentResizeEl;
    this.listenGlobalScrolling = context.listenGlobalScrolling;
  }

  setParent(parent: LContextManager): void {
    this._parent = parent;
  }

  derive(context: LContextIn): LContextData {
    const contextCopied: LContextData = {
      namespace: this.namespace,
      componentDisabled: this.componentDisabled,
      componentSize: this.componentSize,
      componentDefaultProps: Object.assign({}, this.componentDefaultProps),
      layoutPageScrollEl: this.layoutPageScrollEl,
      layoutContentResizeEl: this.layoutContentResizeEl,
      listenGlobalScrolling: this.listenGlobalScrolling,
    };

    (Object.keys(context) as (keyof LContextIn)[]).forEach((key) => {
      if (!isUndefined(context[key])) {
        if (key === 'componentDefaultProps') {
          Object.assign(contextCopied.componentDefaultProps, context[key]);
        } else {
          (contextCopied as any)[key] = context[key];
        }
      }
    });

    return contextCopied;
  }
}

export const LContext = createContext(
  new LContextManager({
    namespace: 'l',
    componentDisabled: false,
    componentSize: 'medium',
    componentDefaultProps: {},
    layoutPageScrollEl: ':root',
    layoutContentResizeEl: null,
    listenGlobalScrolling: false,
  }),
);
