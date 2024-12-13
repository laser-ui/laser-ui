import type { MdRouteProps } from './MdRoute';

import { useStorage } from '@laser-pro/storage';
import { createElement } from 'react';

import { MdRoute } from './MdRoute';
import { STORAGE } from '../../../configs/storage';

export function Route(props: { 'en-US': MdRouteProps; 'zh-CN': MdRouteProps }): React.ReactElement | null {
  const languageStorage = useStorage(...STORAGE.language);

  return createElement(MdRoute, props[languageStorage.value]);
}
