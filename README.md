<p align="center">
  <a href="//laser-ui.surge.sh/" rel="noopener" target="_blank"><img width="150" src="apps/site/public/logo.png" alt="logo"></a>
</p>

<h1 align="center">Laser UI</h1>

<div align="center">

<!-- prettier-ignore-start -->
[![npm latest package](http://img.shields.io/npm/v/@laser-ui/components/latest.svg?style=flat-square)](https://www.npmjs.com/package/@laser-ui/components)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@laser-ui/components?style=flat-square)](https://bundlephobia.com/package/@laser-ui/components)
[![gitHub workflow status](https://img.shields.io/github/actions/workflow/status/laser-ui/laser-ui/main.yml?branch=main&style=flat-square)](https://github.com/laser-ui/laser-ui/actions/workflows/main.yml)
<!-- prettier-ignore-end -->

</div>

<div align="center">

English | [简体中文](README.zh-CN.md)

</div>

## Installation

```bash
npm install @laser-ui/components @laser-ui/hooks @laser-ui/themes @laser-ui/utils
```

## Getting Started

```tsx
import type { LContextIn } from '@laser-ui/components/context';

import { ConfigProvider, Root } from '@laser-ui/components';
import { useMemo } from 'react';

export default function App() {
  const rootContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );

  return (
    <ConfigProvider context={rootContext}>
      <Root>
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

## Links

- [laser-ui.surge.sh](//laser-ui.surge.sh)

## Contributing

Please read our [contributing guide](/CONTRIBUTING.md) first.

## License

[![gitHub license](https://img.shields.io/github/license/laser-ui/laser-ui?style=flat-square)](/LICENSE)
