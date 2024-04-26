import type { RootProps } from './types';

import { useEvent, useRefExtra } from '@laser-ui/hooks';
import { isString, set } from 'lodash';
import { useStore } from 'rcl-store';
import { useEffect, useMemo, useRef } from 'react';

import { ROOT_DATA, RootContext, Store } from './vars';
import dayjs from '../dayjs';
import { Portal } from '../internal/portal';
import resources from '../resources.json';

function WindowSize() {
  const windowSizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (windowSizeRef.current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        ROOT_DATA.windowSize = { width: entry.contentRect.width, height: entry.contentRect.height };
      });
      observer.observe(windowSizeRef.current);
      return () => {
        observer.disconnect();
      };
    }
  });

  return (
    <div
      ref={windowSizeRef}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export function Root(props: RootProps): JSX.Element | null {
  const { context: contextProp, children } = props;

  const windowRef = useRefExtra(() => window);

  const [{ dialogs }] = useStore(Store, ['dialogs']);

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
    <>
      <RootContext.Provider value={context}>
        {children}
        {dialogs.map(({ node }) => node)}
      </RootContext.Provider>
      <Portal selector={() => document.body}>
        <WindowSize />
      </Portal>
    </>
  );
}
