import type { MdRouteProps } from './MdRoute';
import type { Lang } from '@laser-ui/components/types';

import { useStorage } from '@laser-ui/hooks';
import { createElement } from 'react';

import { MdRoute } from './MdRoute';
import { STORAGE_KEY } from '../../../configs/storage';

export function Route(props: { 'en-US': MdRouteProps; 'zh-CN': MdRouteProps }): JSX.Element | null {
  const languageStorage = useStorage<Lang>(...STORAGE_KEY.language);

  return createElement(MdRoute, props[languageStorage.value]);
}
