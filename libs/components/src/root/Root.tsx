import type { RootProps } from './types';

import { useEvent, useRefExtra } from '@laser-ui/hooks';
import { isString, set } from 'lodash';
import { useStore } from 'rcl-store';
import { useEffect, useMemo } from 'react';

import { ROOT_DATA, RootContext, Store } from './vars';
import dayjs from '../dayjs';
import resources from '../resources.json';

export function Root(props: RootProps): React.ReactElement | null {
  const { context: contextProp, children } = props;

  const windowRef = useRefExtra(() => window);

  const [{ dialogs }] = useStore(Store, ['dialogs']);

  useEffect(() => {
    const handleResize = () => {
      ROOT_DATA.windowSize = { width: window.innerWidth, height: window.innerHeight };
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEvent<MouseEvent>(
    windowRef,
    'click',
    (e) => {
      // Check if click by keydown
      if (!(e.clientX === 0 && e.clientY === 0)) {
        const rect = e.target instanceof Element ? e.target.getBoundingClientRect() : null;
        if (rect) {
          ROOT_DATA.clickEvent = {
            time: performance.now(),
            x: e.offsetX + rect.x,
            y: e.offsetX + rect.y,
          };
        }
      }
    },
    { capture: true },
  );

  const context = useMemo(() => {
    const { i18n } = contextProp ?? {};
    const i18nLang = i18n?.lang ?? 'en-US';
    const i18nResources = JSON.parse(JSON.stringify(resources));
    const mergeResources = (path: string[], value: string | object) => {
      if (isString(value)) {
        set(i18nResources, path, value);
      } else {
        Object.entries(value).forEach(([k, v]) => {
          mergeResources(path.concat(k), v);
        });
      }
    };
    mergeResources([], i18n?.resources ?? {});

    return {
      i18nLang,
      i18nResources,
    };
  }, [contextProp]);

  switch (context.i18nLang) {
    case 'en-US':
      dayjs.locale('en');
      break;

    case 'zh-CN':
      dayjs.locale('zh-cn');
      dayjs.updateLocale('zh-cn', {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        meridiem: (hour: number, minute: number, isLowercase: number) => {
          return hour > 12 ? 'PM' : 'AM';
        },
      });
      break;

    default:
      break;
  }

  return (
    <RootContext value={context}>
      {children}
      {dialogs.map(({ node }) => node)}
    </RootContext>
  );
}
