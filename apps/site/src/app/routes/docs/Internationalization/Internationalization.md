# Internationalization

Here is the [full configuration](https://github.com/laser-ui/laser-ui/blob/main/libs/components/src/resources.json).

## Modify language

The default language is `en-US`, if you need to use another language, please configure `Root` component:

```tsx
import type { LContextIn } from '@laser-ui/components/context';

import { ConfigProvider, Root } from '@laser-ui/components';
import { useMemo } from 'react';

export default function App() {
  const lContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );
  const rootContext = useMemo(() => ({ i18n: { lang: 'zh-CN' } }), []);

  return (
    <ConfigProvider context={lContext}>
      <Root context={rootContext}>
        <main id="app-main" style={{ overflow: 'auto' }}>
          <section id="app-content" style={{ height: '200vh' }}>
            Some content...
          </section>
        </main>
      </Root>
    </ConfigProvider>
  );
}
```

## Modify modification

Partially modifications are supported:

```tsx
rootContext = {
  i18n: {
    resources: {
      'en-US': { DatePicker: { Now: 'Present' } },
      'zh-CN': { DatePicker: { Now: '现在' } },
    },
  },
};
```

## Add language

Support for adding languages:

```tsx
rootContext = {
  i18n: {
    resources: {
      lang: 'ja-JP',
      'ja-JP': {
        DatePicker: { Now: '今' },
        ...otherConfig,
      },
    },
  },
};
```
