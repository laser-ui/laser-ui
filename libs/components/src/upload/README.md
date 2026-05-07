---
group: Data Entry
title: Upload
---

Upload files with support for drag and drop, progress tracking, and various display modes.

## API

### UploadProps

```tsx
interface UploadFile {
  uid: React.Key;
  name: string;
  state: UploadFileState;
  url?: string;
  thumbUrl?: string;
  percent?: number;
  originFile?: File;
  response?: any;
}

interface UploadProps extends BaseProps<'upload' | 'upload-list', typeof CLASSES>, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'list'> {
  ref?: React.Ref<HTMLInputElement>;
  children: (props: {
    onClick: React.MouseEventHandler<HTMLElement>;
    onDragEnter?: React.DragEventHandler<HTMLElement>;
    onDragOver?: React.DragEventHandler<HTMLElement>;
    onDrop?: React.DragEventHandler<HTMLElement>;
  }) => React.ReactNode;
  formControl?: FormControlProvider;
  model?: UploadFile[];
  defaultModel?: UploadFile[];
  request?: {
    url: string | URL;
    method?: string;
    responseType?: XMLHttpRequestResponseType;
    header?: { [index: string]: string };
    body?: (file: string | Blob) => Document | XMLHttpRequestBodyInit | null | undefined;
    custom?: (xhr: XMLHttpRequest) => void;
  };
  max?: number;
  drag?: boolean;
  customUpload?: (files: FileList) => void;
  beforeUpload?: (file: File, files: FileList) => boolean | string | Blob | Promise<boolean | string | Blob>;
  onModelChange?: (files: UploadFile[], data: { type: 'add' | 'update' | 'remove'; files: UploadFile[] }) => void;
  onRemove?: (file: UploadFile) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| children | The trigger element render function | - |
| formControl | Form support | - |
| model | The file list | `[]` |
| defaultModel | The default file list | `[]` |
| request | The upload request configuration | - |
| max | The maximum number of files, `1` replaces the existing file | - |
| drag | If `true`, enable drag and drop upload | `false` |
| customUpload | Custom upload handler | - |
| beforeUpload | Hook before upload, return `false` to cancel | - |
| onModelChange | Callback fired when the file list changes | - |
| onRemove | Callback fired when a file is removed | - |
<!-- prettier-ignore-end -->

### UploadButtonProps

```tsx
interface UploadButtonProps extends BaseProps<'upload-button', typeof BUTTON_CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<HTMLDivElement>;
  file?: UploadFile;
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
  onRemove?: () => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| file | The upload file | - |
| actions | Custom action buttons | - |
| defaultActions | Default action handlers | - |
| onRemove | Callback fired when the file is removed | - |
<!-- prettier-ignore-end -->

### UploadActionProps

```tsx
interface UploadActionProps extends BaseProps<'upload-action', typeof ACTION_CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  preset?: 'download' | 'remove';
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| preset | The preset action type | - |
| disabled | If `true`, disable the action | - |
<!-- prettier-ignore-end -->

### UploadPreviewActionProps

```tsx
interface UploadPreviewActionProps extends BaseProps<'upload-action', typeof ACTION_CLASSES>, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: React.Ref<HTMLAnchorElement>;
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| disabled | If `true`, disable the action | - |
<!-- prettier-ignore-end -->

### UploadListProps

```tsx
interface UploadListProps extends BaseProps<'upload-list', typeof LIST_CLASSES>, Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  actions?: (file: UploadFile, index: number) => (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | Custom action buttons for each file | - |
| defaultActions | Default action handlers | - |
<!-- prettier-ignore-end -->

### UploadPictureProps

```tsx
interface UploadPictureProps extends BaseProps<'upload-picture', typeof PICTURE_CLASSES>, React.HTMLAttributes<HTMLUListElement> {
  actions?: (file: UploadFile, index: number) => (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | Custom action buttons for each file | - |
| defaultActions | Default action handlers | - |
<!-- prettier-ignore-end -->

### UploadPictureListProps

```tsx
interface UploadPictureListProps extends BaseProps<'upload-picture-list', typeof PICTURE_LIST_CLASSES>, Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  actions?: (file: UploadFile, index: number) => (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | Custom action buttons for each file | - |
| defaultActions | Default action handlers | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  upload: '^upload',
};

const BUTTON_CLASSES = {
  'upload-button': '^upload-button',
  'upload-button.is-disabled': 'is-disabled',
  'upload-button--load': '^upload-button--load',
  'upload-button--error': '^upload-button--error',
  'upload-button--progress': '^upload-button--progress',
  'upload-button__thumbnail': '^upload-button__thumbnail',
  'upload-button__name': '^upload-button__name',
  'upload-button__actions': '^upload-button__actions',
  'upload-button__icon': '^upload-button__icon',
  'upload-button__text': '^upload-button__text',
};

const ACTION_CLASSES = {
  'upload-action': '^upload-action',
  'upload-action.is-disabled': 'is-disabled',
  'upload-action--light': '^upload-action--light',
  'upload-action--preview': '^upload-action--preview',
};

const LIST_CLASSES = {
  'upload-list': '^upload-list',
  'upload-list__row': '^upload-list__row',
  'upload-list__item': '^upload-list__item',
  'upload-list__item--load': '^upload-list__item--load',
  'upload-list__item--error': '^upload-list__item--error',
  'upload-list__item--progress': '^upload-list__item--progress',
  'upload-list__icon': '^upload-list__icon',
  'upload-list__link': '^upload-list__link',
  'upload-list__link.is-active': 'is-active',
  'upload-list__actions': '^upload-list__actions',
  'upload-list__progress-wrapper': '^upload-list__progress-wrapper',
};

const PICTURE_CLASSES = {
  'upload-picture': '^upload-picture',
  'upload-picture__row': '^upload-picture__row',
  'upload-picture__item': '^upload-picture__item',
  'upload-picture__item.is-disabled': 'is-disabled',
  'upload-picture__item--load': '^upload-picture__item--load',
  'upload-picture__item--error': '^upload-picture__item--error',
  'upload-picture__item--progress': '^upload-picture__item--progress',
  'upload-picture__thumbnail': '^upload-picture__thumbnail',
  'upload-picture__name': '^upload-picture__name',
  'upload-picture__actions': '^upload-picture__actions',
  'upload-picture__progress-text': '^upload-picture__progress-text',
};

const PICTURE_LIST_CLASSES = {
  'upload-picture-list': '^upload-picture-list',
  'upload-picture-list__row': '^upload-picture-list__row',
  'upload-picture-list__item': '^upload-picture-list__item',
  'upload-picture-list__item--load': '^upload-picture-list__item--load',
  'upload-picture-list__item--error': '^upload-picture-list__item--error',
  'upload-picture-list__item--progress': '^upload-picture-list__item--progress',
  'upload-picture-list__thumbnail': '^upload-picture-list__thumbnail',
  'upload-picture-list__thumbnail-img': '^upload-picture-list__thumbnail-img',
  'upload-picture-list__link': '^upload-picture-list__link',
  'upload-picture-list__link.is-active': 'is-active',
  'upload-picture-list__actions': '^upload-picture-list__actions',
  'upload-picture-list__progress-wrapper': '^upload-picture-list__progress-wrapper',
};
```
