---
group: Feedback
title: Progress
aria: meter
---

A component for displaying the current progress of an operation.

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
| Property | Description | Default |
| --- | --- | --- |
| percent | The percentage value | - |
| pattern | The pattern of the progress | `'line'` |
| state | The state of the progress | `'success'` when `percent` is `100`, otherwise `'process'` |
| label | The label content, `false` to hide | - |
| size | The size of the circle/dashboard pattern | `120` |
| wave | If `true`, show the wave animation | `false` |
| lineCap | The line cap style | `'round'` |
| lineWidth | The width of the progress line | `8` |
| gapDegree | The gap degree for the dashboard pattern | `75` |
| linearGradient | The linear gradient colors | - |
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
