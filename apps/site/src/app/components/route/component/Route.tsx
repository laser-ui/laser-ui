import type { ComponentRouteProps } from './ComponentRoute';
import type { Lang } from '@laser-ui/components/types';

import { useStorage } from '@laser-ui/hooks';
import { createElement } from 'react';

import { ComponentRoute } from './ComponentRoute';
import { STORAGE_KEY } from '../../../configs/storage';

export function Route(props: { 'en-US': ComponentRouteProps; 'zh-CN': ComponentRouteProps }): JSX.Element | null {
  const languageStorage = useStorage<Lang>(...STORAGE_KEY.language);

  return createElement(ComponentRoute, props[languageStorage.value]);
}
