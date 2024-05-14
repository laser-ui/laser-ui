import type { MdRouteProps } from './MdRoute';
import type { Lang } from '@laser-ui/components/types';

import { useStorage } from '@laser-ui/admin';
import { createElement } from 'react';

import { MdRoute } from './MdRoute';

export function Route(props: { 'en-US': MdRouteProps; 'zh-CN': MdRouteProps }): JSX.Element | null {
  const languageStorage = useStorage<Lang>('language');

  return createElement(MdRoute, props[languageStorage.value]);
}
