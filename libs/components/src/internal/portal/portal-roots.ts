export function ensurePortalRoot(id: string): HTMLElement {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

export function ensurePortalSubRoot(rootId: string, subId: string): HTMLElement | null {
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
