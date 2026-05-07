---
title: 评分
---

通过星星选择进行评分。

## API

### RatingProps

```tsx
interface RatingProps extends BaseProps<'rating', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  formControl?: FormControlProvider;
  model?: number;
  defaultModel?: number;
  total?: number;
  icon?: React.ReactNode | ((value: number) => React.ReactNode);
  tooltip?: (value: number) => React.ReactNode;
  name?: string;
  half?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onModelChange?: (value: number) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 当前评分值 | - |
| defaultModel | 默认评分值 | - |
| total | 星星总数 | `5` |
| icon | 自定义图标，支持函数按分值返回不同图标 | `<Icon><StarFilled /></Icon>` |
| tooltip | 自定义提示内容 | - |
| name | `input` 元素的 `name` 属性 | `useId` 生成 |
| half | 为 `true` 时，支持半星选择 | `false` |
| readOnly | 为 `true` 时，组件只读 | `false` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| onModelChange | 评分改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  rating: '^rating',
  'rating.is-disabled': 'is-disabled',
  'rating--read-only': '^rating--read-only',
  rating__star: '^rating__star',
  rating__input: '^rating__input',
  'rating__input--half': '^rating__input--half',
  rating__icon: '^rating__icon',
  'rating__icon.is-checked': 'is-checked',
  'rating__icon--half': '^rating__icon--half',
};
```
