import sdk from '@stackblitz/sdk';

import { FILES } from './files';
import packageJson from './files/package.json';

export function openStackBlitz(name: string, tsxSource: string, scssSource?: string) {
  const files: any = {
    'index.html': FILES['index.html'],
    'src/App.tsx': FILES['src/App.tsx'],
    'src/Demo.tsx': tsxSource,
    'src/main.tsx': FILES['src/main.tsx'],
    'src/styles/index.scss': FILES['src/styles/index.scss'],
    'src/styles/vendor/bootstrap.scss': FILES['src/styles/vendor/bootstrap.scss'],
    'src/styles/vendor/laser-ui.scss': FILES['src/styles/vendor/laser-ui.scss'],
    'package.json': packageJson(name),
    'tsconfig.json': FILES['tsconfig.json'],
    'vite.config.ts': FILES['vite.config.ts'],
  };
  if (scssSource) {
    files['src/styles/index.scss'] = `${FILES['src/styles/index.scss']}
${scssSource}`;
  }

  sdk.openProject(
    {
      title: name,
      description: 'Demo of Laser UI',
      template: 'node',
      files: files,
    },
    { openFile: 'Demo.tsx' },
  );
}
