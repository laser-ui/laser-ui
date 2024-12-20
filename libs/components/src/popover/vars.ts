import { createContext } from 'react';

export const CLASSES = {
  popover: '^popover',
  'popover--top': '^popover--top',
  'popover--top-left': '^popover--top-left',
  'popover--top-right': '^popover--top-right',
  'popover--right': '^popover--right',
  'popover--right-top': '^popover--right-top',
  'popover--right-bottom': '^popover--right-bottom',
  'popover--bottom': '^popover--bottom',
  'popover--bottom-left': '^popover--bottom-left',
  'popover--bottom-right': '^popover--bottom-right',
  'popover--left': '^popover--left',
  'popover--left-top': '^popover--left-top',
  'popover--left-bottom': '^popover--left-bottom',
  popover__mask: '^popover__mask',
  popover__content: '^popover__content',
  popover__arrow: '^popover__arrow',
  popover__header: '^popover__header',
  'popover__header-title': '^popover__header-title',
  'popover__header-actions': '^popover__header-actions',
  popover__body: '^popover__body',
  popover__footer: '^popover__footer',
  'popover__footer--left': '^popover__footer--left',
  'popover__footer--center': '^popover__footer--center',
  'popover__footer--right': '^popover__footer--right',
};

export const TTANSITION_DURING = { enter: 86, leave: 100 };

export const PopoverContext = createContext<
  | {
      id: string;
      onClose: () => void;
    }
  | undefined
>(undefined);
