---
title: 组合
---

用于将多个组件组合成一组。

## API

### ComposeProps

```tsx
interface ComposeProps extends BaseProps<'compose', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
  vertical?: boolean;
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| size | 大小 | `medium` |
| vertical | 为 `true` 时，垂直排列 | `false` |
| disabled | 为 `true` 时，禁用组件 | `false` |
<!-- prettier-ignore-end -->

### ComposeItemProps

```tsx
interface ComposeItemProps extends BaseProps<'compose', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  gray?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| gray | 为 `true` 时，项目有灰色背景 | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  compose: '^compose',
  'compose--vertical': '^compose--vertical',
  compose__item: '^compose__item',
  'compose__item--gray': '^compose__item--gray',
  'compose__item--small': '^compose__item--small',
  'compose__item--medium': '^compose__item--medium',
  'compose__item--large': '^compose__item--large',
  'compose__item.is-disabled': 'is-disabled',
};
```
