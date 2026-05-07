---
group: Navigation
title: Stepper
---

A component for displaying progress through a sequence of steps.

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
| Property | Description | Default |
| --- | --- | --- |
| list | The step data list | - |
| active | The current active step | - |
| percent | The progress percentage of the active step | - |
| dotSize | The size of the step dot | `36` |
| clickable | If `true`, steps are clickable | `false` |
| labelBottom | If `true`, labels are placed at the bottom | `false` |
| vertical | If `true`, vertical layout | `false` |
| onClick | Callback fired when a step is clicked | - |
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
