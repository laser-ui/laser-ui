---
group: Data Entry
title: Textarea
---

A multiline text input component.

## API

### TextareaProps

```tsx
interface TextareaProps extends BaseProps<'textarea', typeof CLASSES>, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
  formControl?: FormControlProvider;
  model?: string;
  defaultModel?: string;
  autoRows?: boolean | { minRows?: number; maxRows?: number };
  resizable?: boolean;
  showCount?: boolean | ((count: number) => React.ReactNode);
  size?: Size;
  onModelChange?: (value: string) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | The current value | - |
| defaultModel | The default value | `''` |
| autoRows | If `true`, auto-adjust rows. Can be an object with min/max rows | `false` |
| resizable | If `true`, allow manual resizing | `true` |
| showCount | If `true`, show character count. Can be a custom render function | `false` |
| size | Size | `medium` |
| onModelChange | Callback fired when the value changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  textarea: '^textarea',
  'textarea--small': '^textarea--small',
  'textarea--medium': '^textarea--medium',
  'textarea--large': '^textarea--large',
  textarea__count: '^textarea__count',
};
```
