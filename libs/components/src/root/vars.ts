import type { Lang } from '../types';

import { createStore } from 'rcl-store';
import { createContext } from 'react';

import resources from '../resources.json';

export const Store = createStore<{
  dialogs: { type: any; key: string | number; props: any }[];
}>({
  dialogs: [],
});

export const ROOT_DATA: {
  clickEvent?: {
    time: number;
    x: number;
    y: number;
  };
  windowSize: { width: number; height: number };
} = {
  windowSize: typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 0, height: 0 },
};

export const RootContext = createContext<{
  i18nLang: Lang;
  i18nResources: typeof resources;
}>({
  i18nLang: 'en-US',
  i18nResources: resources,
});
