import { Store } from './vars';

let _key = 0;

export interface DialogInstance<P extends object> {
  key: string | number;
  close: () => void;
  rerender: (props: P) => void;
}

export class DialogService {
  static open<P extends object>(type: React.FC<P>, props: Omit<P, 'visible'>, key?: string | number): DialogInstance<P> {
    const dialogKey = key ?? ++_key;

    Store.set('dialogs', (draft) => {
      draft.push({
        key: dialogKey,
        type,
        props: {
          ...props,
          visible: true,
          skipFirstTransition: false,
          onClose: () => {
            (props as any).onClose?.();

            DialogService.close(dialogKey);
          },
          afterVisibleChange: (visible: boolean) => {
            (props as any).afterVisibleChange?.(visible);

            if (!visible) {
              const index = Store.get('dialogs').findIndex((dialog) => dialog.key === dialogKey);
              if (index !== -1) {
                Store.set('dialogs', (draft) => {
                  draft.splice(index, 1);
                });
              }
            }
          },
        },
      });
    });

    return {
      key: dialogKey,
      close: () => {
        DialogService.close(dialogKey);
      },
      rerender: (props) => {
        DialogService.rerender(dialogKey, type, props);
      },
    };
  }

  static close(key: string | number) {
    const index = Store.get('dialogs').findIndex((dialog) => dialog.key === key);
    if (index !== -1) {
      Store.set('dialogs', (draft) => {
        draft[index].props.visible = false;
      });
    }
  }

  static rerender(key: string | number, type: any, props: any) {
    const index = Store.get('dialogs').findIndex((dialog) => dialog.key === key);
    if (index !== -1) {
      Store.set('dialogs', (draft) => {
        draft.splice(index, 1, { key, type, props: Object.assign(draft[index].props, props) });
      });
    }
  }

  static closeAll(animation = true) {
    if (animation) {
      Store.set('dialogs', (draft) => {
        draft.forEach((dialog) => {
          dialog.props.visible = false;
        });
      });
    } else {
      Store.set('dialogs', []);
    }
  }
}
