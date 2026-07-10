import { transform } from '@svgr/core';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { glob } from 'glob';

const SRC_DIR = 'libs/components/src';
const GEN_DIR = path.join(SRC_DIR, 'icons');

async function main() {
  await fs.rm(GEN_DIR, { recursive: true, force: true });

  const sourceFiles = await glob('**/*.{ts,tsx}', {
    cwd: SRC_DIR,
    absolute: true,
    nodir: true,
  });

  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+\.svg\?react)['"];?/g;
  const svgImports = new Set<string>();

  for (const file of sourceFiles) {
    const content = await fs.readFile(file, 'utf8');
    const matches = Array.from(content.matchAll(importRegex));
    for (const match of matches) {
      svgImports.add(match[2]);
    }
  }

  for (const importPath of Array.from(svgImports)) {
    const cleanPath = importPath.replace('?react', '');
    const resolvedSvgPath = require.resolve(cleanPath);
    const svgContent = await fs.readFile(resolvedSvgPath, 'utf8');

    const relativeSvgPath = cleanPath.replace('@material-design-icons/svg/', '');
    const generatedFileName = relativeSvgPath.replace(/\.svg$/, '.tsx');
    const generatedFilePath = path.join(GEN_DIR, generatedFileName);

    const tsxContent = await transform(
      svgContent,
      {
        plugins: ['@svgr/plugin-jsx'],
        typescript: true,
        jsxRuntime: 'automatic',
      },
      {
        componentName: 'SvgComponent',
        filePath: generatedFilePath,
      },
    );

    await fs.mkdir(path.dirname(generatedFilePath), { recursive: true });
    await fs.writeFile(generatedFilePath, tsxContent);
  }

  console.log(`[generate-components-svgr] Generated ${svgImports.size} SVG components in ${GEN_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
