import { getParameters } from 'codesandbox/lib/api/define';

import { FILES } from './files';
import sandboxConfigJson from './files/codesandbox/sandbox.config.json';
import packageJson from './files/package.json';

export function openCodeSandbox(name: string, tsxSource: string, scssSource?: string) {
  const files: any = {
    'index.html': {
      content: FILES['index.html'],
    },
    'src/App.tsx': {
      content: FILES['src/App.tsx'],
    },
    'src/Demo.tsx': {
      content: tsxSource,
    },
    'src/main.tsx': {
      content: FILES['src/main.tsx'],
    },
    'src/styles/index.scss': {
      content: FILES['src/styles/index.scss'],
    },
    'src/styles/vendor/bootstrap.scss': {
      content: FILES['src/styles/vendor/bootstrap.scss'],
    },
    'src/styles/vendor/laser-ui.scss': {
      content: FILES['src/styles/vendor/laser-ui.scss'],
    },
    'package.json': {
      content: packageJson(name),
    },
    'tsconfig.json': {
      content: FILES['tsconfig.json'],
    },
    'vite.config.ts': {
      content: FILES['vite.config.ts'],
    },
    'sandbox.config.json': {
      content: sandboxConfigJson,
    },
  };
  if (scssSource) {
    files['src/styles/index.scss'] = {
      content: `${FILES['src/styles/index.scss']}
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
