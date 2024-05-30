import { useStorage } from '@laser-pro/storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE } from './app/configs/storage';
import resources from './dist/resources.json';

const configStorage = () =>
  new Promise<void>((r) => {
    const defaultStorage: any = {};
    Object.values(STORAGE).forEach(([key, options]) => {
      defaultStorage[key] = options.defaultValue;
    });
    useStorage.config({ default: defaultStorage });
    r();
  });

const initI18n = () =>
  i18n.use(initReactI18next).init({
    resources,
    lng: useStorage.get(...STORAGE.language),
    interpolation: {
      escapeValue: false,
    },
  });

export const startup = configStorage().then(() => Promise.all([initI18n()]));
