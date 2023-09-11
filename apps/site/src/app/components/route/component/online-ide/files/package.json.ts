import lernaJson from 'lerna.json';
import packageJson from 'package.json';

export default function (name: string) {
  return `{
  "name": "${name}",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.tsx",
  "dependencies": {
    "@laser-ui/components": "${lernaJson.version}",
    "@laser-ui/hooks": "${lernaJson.version}",
    "@laser-ui/themes": "${lernaJson.version}",
    "@laser-ui/utils": "${lernaJson.version}",
    "dayjs": "${packageJson.devDependencies['dayjs']}",
    "react": "${packageJson.devDependencies['react']}",
    "react-dom": "${packageJson.devDependencies['react-dom']}"
  },
  "devDependencies": {
    "@types/react": "${packageJson.devDependencies['@types/react']}",
    "@types/react-dom": "${packageJson.devDependencies['@types/react-dom']}",
    "@vitejs/plugin-react": "${packageJson.devDependencies['@vitejs/plugin-react']}",
    "sass": "${packageJson.devDependencies['sass']}",
    "typescript": "${packageJson.devDependencies['typescript']}",
    "vite": "${packageJson.devDependencies['vite']}",
    "vite-plugin-svgr": "${packageJson.devDependencies['vite-plugin-svgr']}"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build"
  }
}
`;
}
