import type { CLASSES, PREVIEW_CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface ImageProps extends BaseProps<'image', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
}

export interface ImageLoaderProps<K extends keyof HTMLImageElement = 'naturalWidth' | 'naturalHeight'> {
  src: string;
  keys?: K[];
  children: (img: Pick<HTMLImageElement, K>) => React.ReactElement | null;
}

export interface ImageActionProps extends BaseProps<'image', typeof CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

export interface ImagePreviewProps
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
