import type { Theme } from '../types';
import type { LContextIn } from '@laser-ui/components/context';
import type { Lang } from '@laser-ui/components/types';

import { useStorage } from '@laser-ui/admin';
import { ConfigProvider, Root } from '@laser-ui/components';
import highlightDarkStyles from 'highlight.js/styles/github-dark.css?inline';
import highlightStyles from 'highlight.js/styles/github.css?inline';
import { Suspense, createElement, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { FCPLoader } from './components';
import HomeRoute from './routes/home/Home';
import IframeLayout from './routes/layout/IframeLayout';
import Layout from './routes/layout/Layout';
import routes from '../dist/routes';

export function App() {
  const languageStorage = useStorage<Lang>('language');
  const themeStorage = useStorage<Theme>('theme');

  useEffect(() => {
    document.documentElement.lang = languageStorage.value;
  }, [languageStorage.value]);

  useEffect(() => {
    let style = document.querySelector('[data-app-style-id="highlight"]') as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.dataset['appStyleId'] = 'highlight';
      document.head.appendChild(style);
    }
    style.innerHTML = themeStorage.value === 'light' ? highlightStyles : highlightDarkStyles;

    for (const t of ['light', 'dark']) {
      document.body.classList.toggle(t, themeStorage.value === t);
    }
    const colorScheme = document.documentElement.style.colorScheme;
    document.documentElement.style.colorScheme = themeStorage.value;
    return () => {
      document.documentElement.style.colorScheme = colorScheme;
    };
  }, [themeStorage.value]);

  const lContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );
  const rootContext = useMemo(() => ({ i18n: { lang: languageStorage.value } }), [languageStorage.value]);

  return (
    <ConfigProvider context={lContext}>
      <Root context={rootContext}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeRoute />} />
            {routes
              .filter(({ path }) => !path.startsWith('/iframe'))
              .map(({ path, component }) => (
                <Route key={path} path={path} element={<Suspense fallback={<FCPLoader />}>{createElement(component)}</Suspense>} />
              ))}
          </Route>
          <Route element={<IframeLayout />}>
            {routes
              .filter(({ path }) => path.startsWith('/iframe'))
              .map(({ path, component }) => (
                <Route key={path} path={path} element={<Suspense fallback={<FCPLoader />}>{createElement(component)}</Suspense>} />
              ))}
          </Route>
          <Route path="/docs" element={<Navigate to="/docs/Overview" replace />} />
          <Route path="/components" element={<Navigate to="/components/Button" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Root>
    </ConfigProvider>
  );
}

export default App;
