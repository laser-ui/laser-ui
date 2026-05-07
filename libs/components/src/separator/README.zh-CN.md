---
title: 分隔符
---

用于分隔内容的分隔线。

## API

### SeparatorProps

```tsx
interface SeparatorProps extends BaseProps<'separator', typeof CLASSES>, React.HTMLAttributes<HTMLElement> {
  textAlign?: 'left' | 'right' | 'center';
  vertical?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| textAlign | 文本对齐方式 | `'left'` |
| vertical | 为 `true` 时，显示为垂直线 | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  separator: '^separator',
  'separator--text': '^separator--text',
  'separator--text-left': '^separator--text-left',
  'separator--text-right': '^separator--text-right',
  'separator--text-center': '^separator--text-center',
  'separator--vertical': '^separator--vertical',
  separator__text: '^separator__text',
};
```
