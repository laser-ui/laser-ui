export function scrollIntoViewIfNeeded(el: HTMLElement, container: HTMLElement) {
  let top = el.offsetTop;
  let containerEl = el;
  while (containerEl.offsetParent !== container) {
    containerEl = containerEl.offsetParent as HTMLElement;
    top += containerEl.offsetTop;
  }

  const max = top;
  if (container.scrollTop > max) {
    container.scrollTop = max;
  } else {
    const min = top - container.clientHeight + el.offsetHeight;
    if (container.scrollTop < min) {
      container.scrollTop = min;
    }
  }
}
