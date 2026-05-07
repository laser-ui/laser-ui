---
title: 滑动输入条
---

用于在数值区间内选择单个值或范围。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 当前值 | - |
| defaultModel | 默认值 | `range` 为 `true` 时为 `[0, 0]`，否则为 `0` |
| max | 最大值 | `100` |
| min | 最小值 | `0` |
| step | 步长，`null` 为连续 | `1` |
| range | 为 `true` 时，开启范围选择 | `false` |
| rangeMinDistance | 范围模式下两个滑块的最小距离 | - |
| rangeThumbDraggable | 为 `true` 时，范围滑块可拖动 | `false` |
| tooltip | 为 `true` 时显示提示，范围模式下可为数组 | - |
| customTooltip | 自定义提示渲染函数 | - |
| marks | 轨道上的标记点 | - |
| vertical | 为 `true` 时，垂直布局 | `false` |
| reverse | 为 `true` 时，组件反置 | `false` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| inputProps | 输入元素的属性 | - |
| onModelChange | 值改变时的回调函数 | - |
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
