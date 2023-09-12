# 国际化

这里是[完整配置](https://github.com/laser-ui/laser-ui/blob/main/libs/components/src/resources.json)。

## 修改语言

默认语言为 `en-US`，如果需要使用其他语言，请配置 `Root` 组件：

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

## 部分修改

支持部分修改：

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

## 增加语言

支持增加语言：

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
