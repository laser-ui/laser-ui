---
title: 面包屑
---

显示用户当前在层级结构中位置的导航辅助组件。

## API

### BreadcrumbItem

```tsx
interface BreadcrumbItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  link?: boolean;
  separator?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| id | 唯一标识符 | - |
| title | 显示的标题 | - |
| link | 为 `true` 时，显示为链接 | - |
| separator | 该项的自定义分隔符 | - |
<!-- prettier-ignore-end -->

### BreadcrumbProps

```tsx
interface BreadcrumbProps<ID extends React.Key, T extends BreadcrumbItem<ID>>
  extends BaseProps<'breadcrumb', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> {
  list: T[];
  separator?: React.ReactNode;
  onClick?: (id: ID, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| list | 配置面包屑项 | - |
| separator | 默认分隔符 | `'/'` |
| onClick | 点击项时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  breadcrumb: '^breadcrumb',
  breadcrumb__list: '^breadcrumb__list',
  breadcrumb__item: '^breadcrumb__item',
  'breadcrumb__item--link': '^breadcrumb__item--link',
  'breadcrumb__item--last': '^breadcrumb__item--last',
  breadcrumb__separator: '^breadcrumb__separator',
};
```
