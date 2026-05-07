---
group: Data Entry
title: Switch
aria: switch
---

A toggle switch for selecting between two states.

## API

### SwitchProps

```tsx
interface SwitchProps extends BaseProps<'switch', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  stateContent?: [React.ReactNode, React.ReactNode];
  labelPlacement?: 'left' | 'right';
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (checked: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | The checked state | - |
| defaultModel | The default checked state | `false` |
| stateContent | Content for checked and unchecked states | - |
| labelPlacement | The placement of the label | `'right'` |
| size | Size | `medium` |
| loading | If `true`, the component is loading | `false` |
| disabled | If `true`, disable the component | `false` |
| inputProps | Props for the input element | - |
| onModelChange | Callback fired when the checked state changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  switch: '^switch',
  'switch.is-checked': 'is-checked',
  'switch.is-loading': 'is-loading',
  'switch.is-disabled': 'is-disabled',
  'switch--label-left': '^switch--label-left',
  'switch--small': '^switch--small',
  'switch--medium': '^switch--medium',
  'switch--large': '^switch--large',
  'switch__state-container': '^switch__state-container',
  'switch__state-content': '^switch__state-content',
  'switch__state-content--left': '^switch__state-content--left',
  'switch__state-dot': '^switch__state-dot',
  switch__input: '^switch__input',
  switch__label: '^switch__label',
};
```
