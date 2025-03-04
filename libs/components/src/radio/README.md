---
group: Data Entry
title: Radio
aria: radiobutton
---

The `Radio` component.

## API

### RadioProps

```tsx
interface RadioProps extends BaseProps<'radio', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (checked: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | Is it checked | `false` |
| defaultModel | The default checked | - |
| size | Size | `medium` |
| disabled | If `true`, disable the component | `false` |
| inputRef | Pass a `ref` to the `input` element | - |
| inputRender | Customizing the rendering of `input` elements | - |
| onModelChange | Callback fired when the checked is changed | - |
<!-- prettier-ignore-end -->

### RadioGroupProps

```tsx
interface RadioGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

interface RadioGroupProps<V extends React.Key, T extends RadioGroupItem<V>> {
  children: (nodes: React.ReactElement[]) => React.ReactElement;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null;
  defaultModel?: V;
  pattern?: 'outline' | 'fill';
  size?: Size;
  name?: string;
  disabled?: boolean;
  onModelChange?: (value: V, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| list | Configure options | - |
| model | The checked item | The first item of `list` |
| defaultModel | The default checked item | - |
| pattern | Pattern | - |
| size | Size | `medium` |
| name | The `name` attribute of the `input` element | Generated by `useId` |
| disabled | If `true`, disable the component | `false` |
| onModelChange | Callback fired when the checked item is changed | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  radio: '^radio',
  'radio.is-checked': 'is-checked',
  'radio.is-disabled': 'is-disabled',
  'radio--button': '^radio--button',
  'radio--button-outline': '^radio--button-outline',
  'radio--button-fill': '^radio--button-fill',
  'radio--small': '^radio--small',
  'radio--medium': '^radio--medium',
  'radio--large': '^radio--large',
  radio__indicator: '^radio__indicator',
  'radio__input-wrapper': '^radio__input-wrapper',
  radio__input: '^radio__input',
  radio__label: '^radio__label',
};
```
