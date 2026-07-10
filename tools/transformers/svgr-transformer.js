const path = require('node:path');
const ts = require('typescript');

const SVG_REACT_SUFFIX = '.svg?react';
const GENERATED_DIR = path.join(process.cwd(), 'libs/components/src/icons');

function getGeneratedModulePath(importPath, sourceFileDir) {
  // @material-design-icons/svg/outlined/close.svg?react
  // -> libs/components/src/generated/svgr/outlined/close.tsx
  const cleanPath = importPath.replace(SVG_REACT_SUFFIX, '');
  const relativeSvgPath = cleanPath.replace('@material-design-icons/svg/', '');
  const withoutExt = relativeSvgPath.replace(/\.svg$/, '');
  const generatedAbsPath = path.join(GENERATED_DIR, withoutExt);

  let relativePath = path.relative(sourceFileDir, generatedAbsPath).replace(/\\/g, '/');
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

function before(options, program) {
  return (context) => {
    return (sourceFile) => {
      const sourceFileDir = path.dirname(sourceFile.fileName);

      const visitor = (node) => {
        if (
          ts.isImportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const importPath = node.moduleSpecifier.text;
          if (importPath.endsWith(SVG_REACT_SUFFIX)) {
            const generatedPath = getGeneratedModulePath(importPath, sourceFileDir);
            return ts.factory.updateImportDeclaration(
              node,
              node.modifiers,
              node.importClause,
              ts.factory.createStringLiteral(generatedPath),
              node.assertClause,
            );
          }
        }
        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode(sourceFile, visitor);
    };
  };
}

module.exports = { before };
