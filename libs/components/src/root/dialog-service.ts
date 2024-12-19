import type { DialogInstance } from '../dialog-service';

import { useSyncExternalStore } from 'react';

import { DialogService as InternalDialogService } from '../dialog-service';

let dialogs: DialogInstance<any>[] = [];
let listeners: (() => void)[] = [];
function subscribe(onChange: () => void) {
  listeners = listeners.concat([onChange]);
  return () => {
    listeners = listeners.filter((f) => f !== onChange);
  };
}
function getSnapshot() {
  return dialogs;
}
export function useDialogs() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const DialogService = new InternalDialogService((val) => {
  dialogs = val;
  for (const listener of listeners) {
    listener();
  }
});
