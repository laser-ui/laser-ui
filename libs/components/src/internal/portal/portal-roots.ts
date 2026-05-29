const PORTAL_ROOT_IDS = [
  'dropdown-root',
  'tooltip-root',
  'popover-root',
  'modal-root',
  'drawer-root',
  'select-root',
  'tree-select-root',
  'cascader-root',
  'date-picker-root',
  'time-picker-root',
  'menu-root',
  'toast-root',
  'notification-root',
  'image-preview-root',
];

export function ensurePortalRoots(namespace: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  PORTAL_ROOT_IDS.forEach((id) => {
    const fullId = `${namespace}-${id}`;
    if (!document.getElementById(fullId)) {
      const el = document.createElement('div');
      el.id = fullId;
      document.body.appendChild(el);
    }
  });
}

export function destroyPortalRoots(namespace: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  PORTAL_ROOT_IDS.forEach((id) => {
    const el = document.getElementById(`${namespace}-${id}`);
    if (el && el.childNodes.length === 0) {
      document.body.removeChild(el);
    }
  });
}

export function ensurePortalSubRoot(rootId: string, subId: string): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const root = document.getElementById(rootId);
  if (!root) {
    return null;
  }

  let el = document.getElementById(subId);
  if (!el) {
    el = document.createElement('div');
    el.id = subId;
    root.appendChild(el);
  }
  return el;
}
