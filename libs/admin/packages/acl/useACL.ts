import { useSyncExternalStore } from 'react';

import { ACL } from './acl';

let listeners: (() => void)[] = [];

const acl = new ACL(() => {
  for (const listener of listeners) {
    listener();
  }
});

function subscribe(onStoreChange: () => void) {
  listeners = listeners.concat([onStoreChange]);
  return () => {
    listeners = listeners.filter((f) => f !== onStoreChange);
  };
}

function getSnapshot() {
  return acl;
}

export function useACL() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
