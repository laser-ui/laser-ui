---
title: 头像
---

用于展示用户头像、图标或文字的组件。

## API

### AvatarProps

```tsx
interface AvatarProps extends BaseProps<'avatar', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  shape?: 'circle' | 'square';
  img?: React.ImgHTMLAttributes<HTMLImageElement>;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  size?: number | string;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| shape | 头像的形状 | `'circle'` |
| img | 图片属性 | - |
| icon | 自定义图标 | - |
| text | 文字内容 | - |
| size | 头像的大小 | `40` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  avatar: '^avatar',
  'avatar--img': '^avatar--img',
  'avatar--icon': '^avatar--icon',
  'avatar--text': '^avatar--text',
  'avatar--circle': '^avatar--circle',
  'avatar--square': '^avatar--square',
  avatar__img: '^avatar__img',
};
```
