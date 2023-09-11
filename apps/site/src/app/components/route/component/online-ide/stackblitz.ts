import sdk from '@stackblitz/sdk';

import AppTsx from './files/App.tsx';
import indexHtml from './files/index.html';
import mainTsx from './files/main.tsx';
import packageJson from './files/package.json';
import tsconfigJson from './files/tsconfig.json';
import viteConfigTs from './files/vite.config.ts';

import stylesScss from './files/styles.scss';

export function openStackBlitz(name: string, tsxSource: string, scssSource?: string) {
  const files: any = {
    'index.html': indexHtml,
    'src/App.tsx': AppTsx,
    'src/Demo.tsx': tsxSource,
    'src/main.tsx': mainTsx,
    'src/styles.scss': stylesScss,
    'package.json': packageJson(name),
    'tsconfig.json': tsconfigJson,
    'vite.config.ts': viteConfigTs,
  };
  if (scssSource) {
    files['styles.scss'] = `${stylesScss}
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
