---
group: Data Display
title: Image
---

For displaying images with loading, error, and preview support.

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
| Property | Description | Default |
| --- | --- | --- |
| imgProps | The props of the `img` element | - |
| loading | The loading placeholder | - |
| error | The error placeholder | - |
| actions | The actions displayed on hover | - |
<!-- prettier-ignore-end -->

### ImageActionProps

```tsx
interface ImageActionProps extends BaseProps<'image', typeof CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the button element | - |
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
| Property | Description | Default |
| --- | --- | --- |
| list | The list of images to preview | - |
| visible | Whether the preview is visible | - |
| active | The active image index | - |
| defaultActive | The default active image index | `0` |
| escClosable | If `true`, close the preview on Escape key | `true` |
| zIndex | The z-index of the preview | - |
| onActiveChange | Callback fired when the active image changes | - |
| onClose | Callback fired when the preview is closed | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
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
| Property | Description | Default |
| --- | --- | --- |
| src | The image source URL | - |
| keys | The image properties to extract | `['naturalWidth', 'naturalHeight']` |
| children | Render function that receives the image data | - |
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
