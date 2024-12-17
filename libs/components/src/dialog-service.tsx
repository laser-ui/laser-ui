export class DialogInstance<P extends object> {
  public get node(): React.ReactElement<P> {
    const Type = this.type;
    return <Type key={this.key} {...this.props} />;
  }

  constructor(
    public key: string | number,
    private type: React.FC<P>,
    private props: any,
    private service: DialogService,
  ) {}

  public rerender(props: Partial<P>) {
    Object.assign(this.props, props);
    this.service.emitChange(this.key);
  }

  public close() {
    this.props.visible = false;
    this.service.emitChange(this.key);
  }
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
        (props as any).onClose?.();

        const index = this._dialogs.findIndex((dialog) => dialog.key === dialogKey);
        if (index !== -1) {
          const instance = this._dialogs[index];
          instance.close();
        }
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
    const instance: DialogInstance<P> = new DialogInstance(dialogKey, type, dialogProps, this);

    this._dialogs.push(instance);
    this._emitChange();

    return instance;
  }

  emitChange(key: string | number) {
    const index = this._dialogs.findIndex((dialog) => dialog.key === key);
    if (index !== -1) {
      this._emitChange();
    }
  }

  closeAll(animation = true) {
    if (animation) {
      this._dialogs.forEach((dialog) => {
        dialog.close();
      });
    } else {
      this._dialogs = [];
      this._emitChange();
    }
  }
}
