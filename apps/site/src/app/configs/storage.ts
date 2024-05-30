import type { Options } from '@laser-pro/storage/useStorage';

type Key = 'language' | 'theme';
export const STORAGE: { [K in Key]: [K, Options<any>] } = {
  language: ['language', { defaultValue: 'zh-CN' }],
  theme: ['theme', { defaultValue: 'light' }],
};
