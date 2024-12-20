import { createContext } from 'react';

export const CLASSES = {
  modal: '^modal',
  'modal--center': '^modal--center',
  'modal--alert': '^modal--alert',
  modal__content: '^modal__content',
  modal__header: '^modal__header',
  'modal__header-title': '^modal__header-title',
  'modal__header-actions': '^modal__header-actions',
  modal__body: '^modal__body',
  modal__footer: '^modal__footer',
  'modal__footer--left': '^modal__footer--left',
  'modal__footer--center': '^modal__footer--center',
  'modal__footer--right': '^modal__footer--right',
  modal__alert: '^modal__alert',
  'modal__alert--success': '^modal__alert--success',
  'modal__alert--warning': '^modal__alert--warning',
  'modal__alert--error': '^modal__alert--error',
  'modal__alert--info': '^modal__alert--info',
  'modal__alert-icon': '^modal__alert-icon',
  'modal__alert-content': '^modal__alert-content',
  'modal__alert-title': '^modal__alert-title',
  'modal__alert-message': '^modal__alert-message',
};

export const ModalContext = createContext<
  | {
      id: string;
      onClose: () => void;
    }
  | undefined
>(undefined);
