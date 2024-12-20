import type { ComponentRouteProps } from './ComponentRoute';

import { useStorage } from '@laser-pro/storage';

import { ComponentRoute } from './ComponentRoute';
import { STORAGE } from '../../../configs/storage';

export function Route(props: { 'en-US': ComponentRouteProps; 'zh-CN': ComponentRouteProps }): React.ReactElement | null {
  const languageStorage = useStorage(...STORAGE.language);

  return <ComponentRoute {...props[languageStorage.value]} />;
}
