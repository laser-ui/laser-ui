---
group: General
title: FAB
---

Floating Action Button for primary actions on the screen.

## API

### FabProps

```tsx
interface FabProps extends BaseProps<'fab', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  expand?: boolean;
  defaultExpand?: boolean;
  list?: { placement: 'top' | 'right' | 'bottom' | 'left'; actions: (React.ReactNode | { id: React.Key; action: React.ReactNode })[] }[];
  onExpandChange?: (expand: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| children | The trigger button | - |
| expand | Whether the action list is expanded | - |
| defaultExpand | The default expand state | `false` |
| list | The action list grouped by placement | - |
| onExpandChange | Callback fired when the expand state changes | - |
<!-- prettier-ignore-end -->

### FabButtonProps

```tsx
interface FabButtonProps extends BaseProps<'fab-button', typeof BUTTON_CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  pattern?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'link';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  shape?: 'circle' | 'round';
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the button element | - |
| pattern | The button pattern | `'primary'` |
| theme | The color theme | `'primary'` |
| loading | If `true`, show the loading state | `false` |
| shape | The shape of the button | - |
<!-- prettier-ignore-end -->

### FabBacktopProps

```tsx
interface FabBacktopProps extends FabButtonProps {
  page?: RefExtra;
  distance?: number | string;
  scrollBehavior?: 'instant' | 'smooth';
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| page | The scrollable page element | - |
| distance | The distance to show the backtop button | `400` |
| scrollBehavior | The scroll behavior | `'instant'` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  fab: '^fab',
  fab__actions: '^fab__actions',
  'fab__actions--top': '^fab__actions--top',
  'fab__actions--right': '^fab__actions--right',
  'fab__actions--bottom': '^fab__actions--bottom',
  'fab__actions--left': '^fab__actions--left',
};

const BUTTON_CLASSES = {
  'fab-button': '^fab-button',
  'fab-button.t-primary': 't-primary',
  'fab-button.t-success': 't-success',
  'fab-button.t-warning': 't-warning',
  'fab-button.t-danger': 't-danger',
  'fab-button.is-expand': 'is-expand',
  'fab-button.is-loading': 'is-loading',
  'fab-button--in-actions': '^fab-button--in-actions',
  'fab-button--primary': '^fab-button--primary',
  'fab-button--secondary': '^fab-button--secondary',
  'fab-button--outline': '^fab-button--outline',
  'fab-button--dashed': '^fab-button--dashed',
  'fab-button--text': '^fab-button--text',
  'fab-button--link': '^fab-button--link',
  'fab-button--circle': '^fab-button--circle',
  'fab-button--round': '^fab-button--round',
  'fab-button__icon': '^fab-button__icon',
  'fab-button__content': '^fab-button__content',
};
```
