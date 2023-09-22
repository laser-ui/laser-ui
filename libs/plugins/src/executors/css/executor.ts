/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { CssExecutorSchema } from './schema';
import type { ExecutorContext } from '@nx/devkit';

import { join, parse } from 'node:path';

import { CopyAssetsHandler } from '@nx/js/src/utils/assets/copy-assets-handler';
import { calculateProjectBuildableDependencies } from '@nx/js/src/utils/buildable-libs-utils';
import { copySync, outputFileSync, removeSync } from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sass = require('sass');

export default async function runExecutor(options: CssExecutorSchema, context: ExecutorContext) {
  const { target } = calculateProjectBuildableDependencies(
    context.taskGraph,
    context.projectGraph!,
    context.root,
    context.projectName!,
    context.targetName!,
    context.configurationName!,
  );
  const projectRoot = target.data.root;

  if (options.clean) {
    removeSync(options.outputPath);
  }
  copySync(projectRoot, options.outputPath);

  const css = sass.compile(options.main, { loadPaths: ['node_modules'], style: 'compressed' });
  const { name } = parse(options.main);
  outputFileSync(join(options.outputPath, `${name}.min.css`), css.css);

  const assetHandler = new CopyAssetsHandler({
    projectDir: projectRoot,
    rootDir: context.root,
    outputDir: options.outputPath,
    assets: options.assets,
  });
  await assetHandler.processAllAssetsOnce();

  return {
    success: true,
  };
}
