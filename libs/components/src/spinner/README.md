---
group: Feedback
title: Spinner
---

A loading indicator for displaying operation status.

## API

### SpinnerProps

```tsx
interface SpinnerProps extends BaseProps<'spinner', typeof CLASSES>, React.HTMLAttributes<HTMLElement> {
  visible: boolean;
  text?: React.ReactNode;
  size?: number | string;
  delay?: number;
  alone?: boolean;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| visible | If `true`, the spinner is visible | - |
| text | The text to display | - |
| size | The size of the spinner icon | `28` |
| delay | Delay in milliseconds before showing the spinner | - |
| alone | If `true`, positioned according to normal document flow | `false` |
| afterVisibleChange | Callback fired after the visibility changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  spinner: '^spinner',
  'spinner--alone': '^spinner--alone',
  spinner__container: '^spinner__container',
  spinner__icon: '^spinner__icon',
  spinner__text: '^spinner__text',
};
```
