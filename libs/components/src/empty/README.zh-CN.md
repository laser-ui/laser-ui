---
title: 空状态
---

没有数据时的占位符。

## API

### EmptyProps

```tsx
interface EmptyProps extends BaseProps<'empty', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode | typeof SIMPLE_IMG;
  description?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| image | 显示的图片，或使用 `Empty.SIMPLE_IMG` 显示简单图片 | 默认 SVG |
| description | 描述文本 | `'No data'` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  empty: '^empty',
  empty__img: '^empty__img',
  empty__description: '^empty__description',
  empty__footer: '^empty__footer',
};
```
