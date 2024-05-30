import type { AppLang, AppTheme } from '../../types';
import type { Options } from '@laser-pro/storage/useStorage';

type Value<T> = [string, Options<T>];
export const STORAGE = {
  language: ['language', { defaultValue: 'zh-CN' }] as Value<AppLang>,
  theme: ['theme', { defaultValue: 'light' }] as Value<AppTheme>,
};
