---
group: Data Entry
title: Slider
aria: slider
---

For selecting a value or a range from a numeric interval.

## API

### SliderProps

```tsx
interface SliderProps extends BaseProps<'slider', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  formControl?: FormControlProvider;
  model?: number | [number, number];
  defaultModel?: number | [number, number];
  max?: number;
  min?: number;
  step?: number | null;
  range?: boolean;
  rangeMinDistance?: number;
  rangeThumbDraggable?: boolean;
  tooltip?: boolean | [boolean?, boolean?];
  customTooltip?: (value: number) => React.ReactNode;
  marks?: number | ({ value: number; label: React.ReactNode } | number)[];
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  inputProps?: [React.ComponentPropsWithRef<'input'>?, React.ComponentPropsWithRef<'input'>?];
  onModelChange?: (value: any) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | The current value | - |
| defaultModel | The default value | `0` or `[0, 0]` when `range` is `true` |
| max | The maximum value | `100` |
| min | The minimum value | `0` |
| step | The granularity of the value, `null` for continuous | `1` |
| range | If `true`, enable range selection | `false` |
| rangeMinDistance | The minimum distance between two thumbs in range mode | - |
| rangeThumbDraggable | If `true`, the range thumb is draggable | `false` |
| tooltip | If `true`, show tooltip. Can be an array for range mode | - |
| customTooltip | Custom tooltip render function | - |
| marks | Mark points on the track | - |
| vertical | If `true`, vertical layout | `false` |
| reverse | If `true`, reverse the component | `false` |
| disabled | If `true`, disable the component | `false` |
| inputProps | Props for the input element(s) | - |
| onModelChange | Callback fired when the value changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  slider: '^slider',
  'slider.is-disabled': 'is-disabled',
  'slider--horizontal': '^slider--horizontal',
  'slider--vertical': '^slider--vertical',
  slider__track: '^slider__track',
  'slider__track--reverse': '^slider__track--reverse',
  slider__thumb: '^slider__thumb',
  'slider__thumb.is-focused': 'is-focused',
  'slider__thumb--draggable': '^slider__thumb--draggable',
  slider__mark: '^slider__mark',
  'slider__mark--hidden': '^slider__mark--hidden',
  'slider__mark-label': '^slider__mark-label',
  'slider__mark-label.is-active': 'is-active',
  'slider__input-wrapper': '^slider__input-wrapper',
  slider__input: '^slider__input',
};
```
