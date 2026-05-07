---
title: 文本域
---

多行文本输入组件。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 当前值 | - |
| defaultModel | 默认值 | `''` |
| autoRows | 为 `true` 时，自动调整行数。可为包含最小/最大行数的对象 | `false` |
| resizable | 为 `true` 时，允许手动调整大小 | `true` |
| showCount | 为 `true` 时，显示字符数。可为自定义渲染函数 | `false` |
| size | 大小 | `medium` |
| onModelChange | 值改变时的回调函数 | - |
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
