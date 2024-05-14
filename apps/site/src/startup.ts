import { useStorage } from '@laser-ui/admin';
import { CONFIGS } from '@laser-ui/admin/packages/storage/configs';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE } from './app/configs/storage';
import resources from './dist/resources.json';

export const startup = new Promise<void>((r) => {
  const defaultStorage: any = {};
  Object.values(STORAGE).forEach(([key, options]) => {
    defaultStorage[key] = options.defaultValue;
  });
  useStorage.config({ default: defaultStorage });
  r();
}).then(() => {
  return i18n.use(initReactI18next).init({
    resources,
    lng: CONFIGS.service.getItem(STORAGE.language[0]) ?? STORAGE.language[1].defaultValue,
    interpolation: {
      escapeValue: false,
    },
  });
});
