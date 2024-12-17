import type { Size } from '../types';

import { createContext } from 'react';

export const CLASSES = {
  radio: '^radio',
  'radio.is-checked': 'is-checked',
  'radio.is-disabled': 'is-disabled',
  'radio--button': '^radio--button',
  'radio--button-outline': '^radio--button-outline',
  'radio--button-fill': '^radio--button-fill',
  'radio--button-small': '^radio--button-small',
  'radio--button-medium': '^radio--button-medium',
  'radio--button-large': '^radio--button-large',
  'radio__input-wrapper': '^radio__input-wrapper',
  radio__input: '^radio__input',
  radio__label: '^radio__label',
};

export const RadioGroupContext = createContext<
  | {
      pattern?: 'outline' | 'fill';
      size: Size;
    }
  | undefined
>(undefined);
