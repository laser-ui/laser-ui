---
group: Data Entry
title: Checkbox
aria: checkbox
---

For selecting multiple options from a set.

## API

### CheckboxProps

```tsx
interface CheckboxProps extends BaseProps<'checkbox', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (checked: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | Specifies whether the checkbox is checked | `false` |
| defaultModel | The default checked state | - |
| indeterminate | The indeterminate state | `false` |
| disabled | If `true`, disable the component | `false` |
| inputProps | The props of the `input` element | - |
| onModelChange | Callback fired when the checked state changes | - |
<!-- prettier-ignore-end -->

### CheckboxGroupProps

```tsx
interface CheckboxGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

interface CheckboxGroupProps<V extends React.Key, T extends CheckboxGroupItem<V>> {
  children: (
    props: { role: 'group' },
    optionProps: (option: T) => {
      children: React.ReactNode;
      model: boolean;
      disabled: boolean;
      inputProps?: {
        'aria-invalid'?: boolean;
        'aria-describedby'?: string;
      };
      onModelChange: (checked: boolean) => void;
    },
    options: T[],
  ) => React.ReactElement | null;
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  disabled?: boolean;
  onModelChange?: (values: V[], origins: T[]) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| list | Configure options | - |
| model | The checked items | `[]` |
| defaultModel | The default checked items | - |
| disabled | If `true`, disable the component | `false` |
| onModelChange | Callback fired when the checked items change | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  checkbox: '^checkbox',
  'checkbox.is-checked': 'is-checked',
  'checkbox.is-indeterminate': 'is-indeterminate',
  'checkbox.is-disabled': 'is-disabled',
  'checkbox__state-container': '^checkbox__state-container',
  checkbox__input: '^checkbox__input',
  checkbox__indeterminate: '^checkbox__indeterminate',
  checkbox__tick: '^checkbox__tick',
  checkbox__label: '^checkbox__label',
};
```
