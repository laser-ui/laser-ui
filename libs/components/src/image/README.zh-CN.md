---
title: 图片
---

用于显示图片，支持加载、错误和预览功能。

## API

### ImageProps

```tsx
interface ImageProps extends BaseProps<'image', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| imgProps | `img` 元素的属性 | - |
| loading | 加载时的占位内容 | - |
| error | 错误时的占位内容 | - |
| actions | 悬停时显示的操作 | - |
<!-- prettier-ignore-end -->

### ImageActionProps

```tsx
interface ImageActionProps extends BaseProps<'image', typeof CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 按钮元素的 ref | - |
<!-- prettier-ignore-end -->

### ImagePreviewProps

```tsx
interface ImagePreviewProps
  extends BaseProps<'image-preview', typeof PREVIEW_CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: React.ImgHTMLAttributes<HTMLImageElement>[];
  visible: boolean;
  active?: number;
  defaultActive?: number;
  escClosable?: boolean;
  zIndex?: number | string;
  onActiveChange?: (index: number) => void;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| list | 要预览的图片列表 | - |
| visible | 预览是否可见 | - |
| active | 当前激活的图片索引 | - |
| defaultActive | 默认激活的图片索引 | `0` |
| escClosable | 为 `true` 时，按 Esc 键关闭预览 | `true` |
| zIndex | 预览的 z-index | - |
| onActiveChange | 当前图片改变时的回调函数 | - |
| onClose | 预览关闭时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
<!-- prettier-ignore-end -->

### ImageLoaderProps

```tsx
interface ImageLoaderProps<K extends keyof HTMLImageElement = 'naturalWidth' | 'naturalHeight'> {
  src: string;
  keys?: K[];
  children: (img: Pick<HTMLImageElement, K>) => React.ReactElement | null;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| src | 图片源 URL | - |
| keys | 要提取的图片属性 | `['naturalWidth', 'naturalHeight']` |
| children | 接收图片数据的渲染函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  image: '^image',
  image__img: '^image__img',
  image__actions: '^image__actions',
  image__action: '^image__action',
};

const PREVIEW_CLASSES = {
  'image-preview': '^image-preview',
  'image-preview__navigation-button': '^image-preview__navigation-button',
  'image-preview__navigation-button--prev': '^image-preview__navigation-button--prev',
  'image-preview__navigation-button--next': '^image-preview__navigation-button--next',
  'image-preview__toolbar': '^image-preview__toolbar',
  'image-preview__toolbar-page': '^image-preview__toolbar-page',
  'image-preview__toolbar-page-input': '^image-preview__toolbar-page-input',
  'image-preview__toolbar-rotate': '^image-preview__toolbar-rotate',
  'image-preview__toolbar-zoom-out': '^image-preview__toolbar-zoom-out',
  'image-preview__toolbar-zoom-in': '^image-preview__toolbar-zoom-in',
  'image-preview__toolbar-close': '^image-preview__toolbar-close',
  'image-preview__img-wrapper': '^image-preview__img-wrapper',
  'image-preview__img': '^image-preview__img',
  'image-preview__thumbnail-list': '^image-preview__thumbnail-list',
  'image-preview__thumbnail': '^image-preview__thumbnail',
  'image-preview__thumbnail.is-active': 'is-active',
  'image-preview__thumbnail-img': '^image-preview__thumbnail-img',
};
```
