---
group: Data Entry
title: Form
---

For data collection and validation.

## API

### FormProps

```tsx
interface FormProps extends BaseProps<'form', typeof CLASSES>, React.FormHTMLAttributes<HTMLFormElement> {
  vertical?: boolean;
  labelWidth?: number | string;
  labelWrap?: boolean;
  labelColon?: boolean;
  requiredType?: 'required' | 'optional' | 'hidden';
  feedbackIcon?:
    | boolean
    | {
        success?: React.ReactNode;
        warning?: React.ReactNode;
        error?: React.ReactNode;
        pending?: React.ReactNode;
      };
  size?: Size;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| vertical | If `true`, the form is vertical | `false` |
| labelWidth | The width of the label | `'auto'` |
| labelWrap | If `true`, the label text wraps | `false` |
| labelColon | If `true`, show a colon after the label | `true` (horizontal) / `false` (vertical) |
| requiredType | The display mode for required fields | `'required'` |
| feedbackIcon | The feedback icon configuration | `false` |
| size | Size | `medium` |
<!-- prettier-ignore-end -->

### FormItemProps

```tsx
interface FormItemProps<T extends { [index: string]: FormErrors }>
  extends BaseProps<'form', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode | ((formControls: { [N in keyof T]: FormControlProvider }) => React.ReactNode);
  formControls?: T;
  label?: React.ReactNode;
  labelWidth?: number | string;
  labelWrap?: boolean;
  labelExtra?: { title: string; icon?: React.ReactElement } | string;
  labelFor?: string;
  required?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| children | The form item content, or a render function that receives form controls | - |
| formControls | The form controls with error messages | - |
| label | The label text | - |
| labelWidth | The width of the label | inherits from Form |
| labelWrap | If `true`, the label text wraps | inherits from Form |
| labelExtra | Extra information for the label | - |
| labelFor | The `for` attribute of the label | - |
| required | If `true`, the field is required | auto-detected |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  form: '^form',
  'form--small': '^form--small',
  'form--medium': '^form--medium',
  'form--large': '^form--large',
  form__row: '^form__row',
  form__item: '^form__item',
  'form__item-container': '^form__item-container',
  'form__item-label-wrapper': '^form__item-label-wrapper',
  'form__item-label': '^form__item-label',
  'form__item-label--wrap': '^form__item-label--wrap',
  'form__item-label--required': '^form__item-label--required',
  'form__item-label--colon': '^form__item-label--colon',
  'form__item-label-extra': '^form__item-label-extra',
  'form__item-content': '^form__item-content',
  'form__item-control': '^form__item-control',
  'form__item-feedback-icon': '^form__item-feedback-icon',
  'form__error-container': '^form__error-container',
  form__error: '^form__error',
  'form__error--error': '^form__error--error',
  'form__error--warning': '^form__error--warning',
};
```
