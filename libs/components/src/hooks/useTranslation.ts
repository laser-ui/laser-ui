import { get } from 'lodash';
import { use } from 'react';

import { RootContext } from '../root/vars';

export function useTranslation() {
  const context = use(RootContext);
  const lang = context.i18nLang;

  return {
    t: (...path: string[]) => {
      if (path.length === 1) {
        path = ['Common', path[0]];
      }
      path.unshift(lang);

      return get(context.i18nResources, path, path.join('.'));
    },
    lang,
  };
}
