import type { UploadFile } from './types';

import { createContext } from 'react';

export const CLASSES = {
  upload: '^upload',
};

export const BUTTON_CLASSES = {
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

export const ACTION_CLASSES = {
  'upload-action': '^upload-action',
  'upload-action.is-disabled': 'is-disabled',
  'upload-action--light': '^upload-action--light',
  'upload-action--preview': '^upload-action--preview',
};

export const LIST_CLASSES = {
  'upload-list': '^upload-list',
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

export const PICTURE_CLASSES = {
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

export const PICTURE_LIST_CLASSES = {
  'upload-picture-list': '^upload-picture-list',
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

export const UploadContext = createContext<{
  files: UploadFile[];
  onRemove: (file: UploadFile) => void;
}>({
  files: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRemove: () => {},
});
