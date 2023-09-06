import type { ACTION_CLASSES, BUTTON_CLASSES, CLASSES, LIST_CLASSES, PICTURE_CLASSES, PICTURE_LIST_CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement } from '../types';

export {};

export type UploadFileState = 'load' | 'error' | 'progress' | null;

export interface UploadFile {
  uid: React.Key;
  name: string;
  state: UploadFileState;
  url?: string;
  thumbUrl?: string;
  percent?: number;
  originFile?: File;
  response?: any;
}

export interface UploadProps
  extends BaseProps<'upload' | 'upload-list', typeof CLASSES>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'list'> {
  children: React.ReactElement | ((render: CloneHTMLElement) => JSX.Element | null);
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
  onModelChange?: (
    files: UploadFile[],
    data: {
      type: 'add' | 'update' | 'remove';
      files: UploadFile[];
    },
  ) => void;
  onRemove?: (file: UploadFile) => void;
}

export interface UploadButtonProps
  extends BaseProps<'upload-button', typeof BUTTON_CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  file?: UploadFile;
  actions?: React.ReactNode[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
  onRemove?: () => void;
}

export interface UploadActionProps extends BaseProps<'upload-action', typeof ACTION_CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  preset?: 'download' | 'remove';
  disabled?: boolean;
}

export interface UploadPreviewActionProps
  extends BaseProps<'upload-action', typeof ACTION_CLASSES>,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
}

export interface UploadListProps
  extends BaseProps<'upload-list', typeof LIST_CLASSES>,
    Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  actions?: (file: UploadFile, index: number) => React.ReactNode[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
}

export interface UploadPictureProps extends BaseProps<'upload-picture', typeof PICTURE_CLASSES>, React.HTMLAttributes<HTMLUListElement> {
  actions?: (file: UploadFile, index: number) => React.ReactNode[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
}

export interface UploadPictureListProps
  extends BaseProps<'upload-picture-list', typeof PICTURE_LIST_CLASSES>,
    Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  actions?: (file: UploadFile, index: number) => React.ReactNode[];
  defaultActions?: {
    preview?: (file: UploadFile) => void;
    download?: (file: UploadFile) => void;
  };
}
