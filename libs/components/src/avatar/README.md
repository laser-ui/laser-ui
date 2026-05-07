---
group: Data Display
title: Avatar
aria: img
---

A component for displaying user profile pictures, icons, or text.

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
| Property | Description | Default |
| --- | --- | --- |
| shape | The shape of the avatar | `'circle'` |
| img | Image attributes | - |
| icon | Custom icon | - |
| text | Text content | - |
| size | The size of the avatar | `40` |
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
