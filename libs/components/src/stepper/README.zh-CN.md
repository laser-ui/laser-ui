---
title: 步骤条
---

用于展示步骤序列进度的组件。

## API

### StepperProps

```tsx
interface StepperItem {
  step?: number;
  title: React.ReactNode;
  description?: React.ReactNode;
  state?: 'wait' | 'active' | 'completed' | 'warning' | 'error';
  color?: string;
  dot?: React.ReactNode;
}

interface StepperProps<T extends StepperItem>
  extends BaseProps<'stepper', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  list: T[];
  active: number;
  percent?: number;
  dotSize?: number;
  clickable?: boolean;
  labelBottom?: boolean;
  vertical?: boolean;
  onClick?: (step: number, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| list | 步骤数据列表 | - |
| active | 当前激活的步骤 | - |
| percent | 当前步骤的进度百分比 | - |
| dotSize | 步骤轴点的大小 | `36` |
| clickable | 为 `true` 时，步骤可点击 | `false` |
| labelBottom | 为 `true` 时，标签置底 | `false` |
| vertical | 为 `true` 时，垂直布局 | `false` |
| onClick | 点击步骤时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  stepper: '^stepper',
  'stepper--button': '^stepper--button',
  'stepper--label-bottom': '^stepper--label-bottom',
  'stepper--vertical': '^stepper--vertical',
  stepper__step: '^stepper__step',
  'stepper__step.is-wait': 'is-wait',
  'stepper__step.is-active': 'is-active',
  'stepper__step.is-completed': 'is-completed',
  'stepper__step.is-warning': 'is-warning',
  'stepper__step.is-error': 'is-error',
  'stepper__step-header': '^stepper__step-header',
  'stepper__step-title': '^stepper__step-title',
  'stepper__step-description': '^stepper__step-description',
  'stepper__step-dot': '^stepper__step-dot',
  'stepper__step-dot--progress': '^stepper__step-dot--progress',
  'stepper__step-separator': '^stepper__step-separator',
  'stepper__step-progress': '^stepper__step-progress',
};
```
