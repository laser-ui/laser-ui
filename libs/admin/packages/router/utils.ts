export function querySelector(selector?: string) {
  if (selector && typeof window !== 'undefined') {
    return document.querySelector(selector);
  }
  return null;
}
