import { cloneElement, createElement } from 'react';

export interface DialogInstance<P extends object> {
  key: string | number;
  node: React.FunctionComponentElement<P>;
  close: () => void;
  rerender: (props: P) => void;
}

export class DialogService {
  private _key = -1;
  private _dialogs: DialogInstance<any>[] = [];
  private _emitChange: () => void;

  constructor(emitChange: (dialogs: DialogInstance<any>[]) => void) {
    this._emitChange = () => {
      emitChange(([] as DialogInstance<any>[]).concat(this._dialogs));
    };
  }

  open<P extends object>(type: React.FC<P>, props: Omit<P, 'visible'>, key?: string | number): DialogInstance<P> {
    const dialogKey = key ?? `l_#${++this._key}`;
    const dialogProps = {
      ...props,
      visible: true,
      skipFirstTransition: false,
      onClose: () => {
        this.close(dialogKey);

        (props as any).onClose?.();
      },
      afterVisibleChange: (visible: boolean) => {
        (props as any).afterVisibleChange?.(visible);

        if (!visible) {
          const index = this._dialogs.findIndex((dialog) => dialog.key === dialogKey);
          if (index !== -1) {
            this._dialogs.splice(index, 1);
            this._emitChange();
          }
        }
      },
    };
    const node = createElement(type, { key: dialogKey, ...dialogProps } as any);
    const instance: DialogInstance<P> = {
      key: dialogKey,
      node,
      close: () => {
        this.close(dialogKey);
      },
      rerender: (props) => {
        this.rerender(dialogKey, props);
      },
    };

    this._dialogs.push(instance);
    this._emitChange();

    return instance;
  }

  close(key: string | number) {
    const index = this._dialogs.findIndex((dialog) => dialog.key === key);
    if (index !== -1) {
      const instance = this._dialogs[index];
      instance.node = cloneElement(instance.node, { visible: false });
      this._emitChange();
    }
  }

  rerender(key: string | number, props: any) {
    const index = this._dialogs.findIndex((dialog) => dialog.key === key);
    if (index !== -1) {
      const instance = this._dialogs[index];
      instance.node = cloneElement(instance.node, props);
      this._emitChange();
    }
  }

  closeAll(animation = true) {
    if (animation) {
      this._dialogs.forEach((dialog) => {
        dialog.node = cloneElement(dialog.node, { visible: false });
      });
    } else {
      this._dialogs = [];
    }
    this._emitChange();
  }
}
