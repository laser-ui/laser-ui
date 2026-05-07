---
title: 标签
---

用于分类或标记项目的标签组件。

## API

### TagProps

```tsx
interface TagProps extends BaseProps<'tag', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  pattern?: 'primary' | 'fill' | 'outline';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  size?: Size;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| pattern | 标签的形态 | `'primary'` |
| theme | 主题色 | - |
| size | 大小 | `medium` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  tag: '^tag',
  'tag.t-primary': 't-primary',
  'tag.t-success': 't-success',
  'tag.t-warning': 't-warning',
  'tag.t-danger': 't-danger',
  'tag--primary': '^tag--primary',
  'tag--fill': '^tag--fill',
  'tag--outline': '^tag--outline',
  'tag--small': '^tag--small',
  'tag--medium': '^tag--medium',
  'tag--large': '^tag--large',
};
```
