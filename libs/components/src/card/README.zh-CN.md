---
title: 卡片
---

用于对相关内容进行分组的容器。

## API

### CardProps

```tsx
interface CardProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean | 'hover';
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| shadow | 为 `true` 或 `'hover'` 时，显示阴影效果 | `false` |
<!-- prettier-ignore-end -->

### CardHeaderProps

```tsx
interface CardHeaderProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| action | 头部的操作元素 | - |
<!-- prettier-ignore-end -->

### CardContentProps

```tsx
interface CardContentProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {}
```

### CardActionsProps

```tsx
interface CardActionsProps extends BaseProps<'card', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  actions: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| actions | 要显示的操作 | - |
<!-- prettier-ignore-end -->

### CardActionProps

```tsx
interface CardActionProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 元素的 ref | - |
| disabled | 为 `true` 时，禁用操作 | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  card: '^card',
  'card--shadow': '^card--shadow',
  'card--shadow-hover': '^card--shadow-hover',
  card__header: '^card__header',
  'card__header-title': '^card__header-title',
  'card__header-action': '^card__header-action',
  card__content: '^card__content',
  card__actions: '^card__actions',
  card__action: '^card__action',
  'card__action.is-disabled': 'is-disabled',
};
```
