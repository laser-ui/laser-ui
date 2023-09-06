function getCssStyle(element: Element, prop: string) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

export class TextWidth {
  static getCanvasFont(el: Element) {
    const fontWeight = getCssStyle(el, 'font-weight');
    const fontSize = getCssStyle(el, 'font-size');
    const fontFamily = getCssStyle(el, 'font-family');

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  static getTextWidth(text: string, font: string) {
    const canvas = document.createElement('canvas');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  private _canvas: HTMLCanvasElement;

  constructor(canvas?: HTMLCanvasElement) {
    this._canvas = canvas ?? document.createElement('canvas');
  }

  getTextWidth(text: string, font: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = this._canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
}
