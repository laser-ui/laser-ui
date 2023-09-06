import type { FormGroup } from './model/form-group';
import type { FormContextData } from './types';

import { createContext } from 'react';

export const CLASSES = {
  form: '^form',
  'form--small': '^form--small',
  'form--medium': '^form--medium',
  'form--large': '^form--large',
  form__row: '^form__row',
  form__item: '^form__item',
  'form__item-container': '^form__item-container',
  'form__item-label-wrapper': '^form__item-label-wrapper',
  'form__item-label': '^form__item-label',
  'form__item-label--auto': '^form__item-label--auto',
  'form__item-label--required': '^form__item-label--required',
  'form__item-label--colon': '^form__item-label--colon',
  'form__item-label-extra': '^form__item-label-extra',
  'form__item-content': '^form__item-content',
  'form__item-control': '^form__item-control',
  'form__item-feedback-icon': '^form__item-feedback-icon',
  'form__error-container': '^form__error-container',
  form__error: '^form__error',
  'form__error--error': '^form__error--error',
  'form__error--warning': '^form__error--warning',
};

export const FormContext = createContext<FormContextData>(undefined as any);

export const FormGroupContext = createContext<FormGroup>(undefined as any);
