import type { Options } from '@laser-ui/admin/packages/storage/useStorage';

type Key = 'language' | 'theme';
export const STORAGE: { [K in Key]: [K, Options<any>] } = {
  language: ['language', { defaultValue: 'zh-CN' }],
  theme: ['theme', { defaultValue: 'light' }],
};
