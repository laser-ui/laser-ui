import { getParameters } from 'codesandbox/lib/api/define';

import AppTsx from './files/App.tsx';
import sandboxConfigJson from './files/codesandbox/sandbox.config.json.js';
import indexHtml from './files/index.html';
import mainTsx from './files/main.tsx';
import packageJson from './files/package.json';
import tsconfigJson from './files/tsconfig.json';
import viteConfigTs from './files/vite.config.ts';

import stylesScss from './files/styles.scss';

export function openCodeSandbox(name: string, tsxSource: string, scssSource?: string) {
  const files: any = {
    'index.html': {
      content: indexHtml,
    },
    'src/App.tsx': {
      content: AppTsx,
    },
    'src/Demo.tsx': {
      content: tsxSource,
    },
    'src/main.tsx': {
      content: mainTsx,
    },
    'src/styles.scss': {
      content: stylesScss,
    },
    'package.json': {
      content: packageJson(name),
    },
    'tsconfig.json': {
      content: tsconfigJson,
    },
    'vite.config.ts': {
      content: viteConfigTs,
    },
    'sandbox.config.json': {
      content: sandboxConfigJson,
    },
  };
  if (scssSource) {
    files['src/styles.scss'] = {
      content: `${stylesScss}
${scssSource}`,
    };
  }
  const parameters = getParameters({ files });

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
  form.target = '_blank';
  const parametersInput = document.createElement('input');
  parametersInput.name = 'parameters';
  parametersInput.value = parameters;
  const queryInput = document.createElement('input');
  queryInput.name = 'query';
  queryInput.value = 'module=/src/Demo.tsx';
  form.appendChild(parametersInput);
  form.appendChild(queryInput);
  document.body.append(form);
  form.submit();
  document.body.removeChild(form);
}
