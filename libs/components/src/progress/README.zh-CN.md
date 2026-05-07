---
title: 进度条
---

用于展示操作当前进度的组件。

## API

### ProgressProps

```tsx
interface ProgressProps extends BaseProps<'progress', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  percent: number;
  pattern?: 'line' | 'circle' | 'dashboard';
  state?: 'success' | 'warning' | 'error' | 'process';
  label?: React.ReactNode;
  size?: number;
  wave?: boolean;
  lineCap?: 'butt' | 'round';
  lineWidth?: number;
  gapDegree?: number;
  linearGradient?: { 0: string; 100: string };
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| percent | 百分比值 | - |
| pattern | 进度条形态 | `'line'` |
| state | 进度条状态 | `percent` 为 `100` 时为 `'success'`，否则为 `'process'` |
| label | 标签内容，`false` 隐藏 | - |
| size | 圆形/仪表盘形态的大小 | `120` |
| wave | 为 `true` 时，显示波浪动画 | `false` |
| lineCap | 线条端点样式 | `'round'` |
| lineWidth | 进度线宽度 | `8` |
| gapDegree | 仪表盘形态的缺口角度 | `75` |
| linearGradient | 线性渐变颜色 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  progress: '^progress',
  'progress--line': '^progress--line',
  'progress--circle': '^progress--circle',
  'progress--dashboard': '^progress--dashboard',
  'progress--success': '^progress--success',
  'progress--warning': '^progress--warning',
  'progress--error': '^progress--error',
  'progress--process': '^progress--process',
  'progress__line-track': '^progress__line-track',
  'progress__line-bar': '^progress__line-bar',
  'progress__line-wave': '^progress__line-wave',
  progress__svg: '^progress__svg',
  progress__label: '^progress__label',
};
```
