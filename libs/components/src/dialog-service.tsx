export class DialogInstance<P extends object> {
  public visible = true;

  public get node(): React.ReactElement<P> {
    const Type = this.type;
    return (
      <Type
        key={this.key}
        {...this.props}
        visible={this.visible}
        skipFirstTransition={this.props.skipFirstTransition ?? false}
        onClose={() => {
          const res = this.props.onClose?.();
          if (res !== false) {
            this.close();
          }
        }}
        afterVisibleChange={(visible: boolean) => {
          this.props.afterVisibleChange?.(visible);
          if (!visible) {
            const index = this.service.dialogs.findIndex((dialog) => dialog.key === this.key);
            if (index !== -1) {
              this.service.dialogs.splice(index, 1);
            }
            this.service.emitChange(this.key);
          }
        }}
      />
    );
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
    this.visible = false;
    this.service.emitChange(this.key);
  }
}

export class DialogService {
  private _key = -1;
  private _emitChange: () => void;

  public dialogs: DialogInstance<any>[] = [];

  constructor(emitChange: (dialogs: DialogInstance<any>[]) => void) {
    this._emitChange = () => {
      emitChange(([] as DialogInstance<any>[]).concat(this.dialogs));
    };
  }

  open<P extends object>(type: React.FC<P>, props: Omit<P, 'visible'>, key?: string | number): DialogInstance<P> {
    const dialogKey = key ?? `l_#${++this._key}`;
    const instance: DialogInstance<P> = new DialogInstance(dialogKey, type, props, this);

    this.dialogs.push(instance);
    this._emitChange();

    return instance;
  }

  emitChange(key: string | number) {
    const index = this.dialogs.findIndex((dialog) => dialog.key === key);
    if (index !== -1) {
      this._emitChange();
    }
  }

  closeAll(animation = true) {
    if (animation) {
      this.dialogs.forEach((dialog) => {
        dialog.close();
      });
    } else {
      this.dialogs = [];
      this._emitChange();
    }
  }
}
