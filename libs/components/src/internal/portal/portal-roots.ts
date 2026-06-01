export function ensurePortalRoot(id: string, parent: HTMLElement = document.body): HTMLElement {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    parent.appendChild(el);
  }
  return el;
}
