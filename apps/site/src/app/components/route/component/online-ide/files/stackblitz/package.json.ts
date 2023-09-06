import lernaJson from 'lerna.json';
import packageJson from 'package.json';

export default function (name: string) {
  return [
    `{
    "name": "${name} - ${lernaJson.version}",
    "version": "0.0.0",
    "private": true,
    "dependencies": {
      "@laser-ui/components": "${lernaJson.version}",
      "@laser-ui/hooks": "${lernaJson.version}",
      "@laser-ui/themes": "${lernaJson.version}",
      "@laser-ui/utils": "${lernaJson.version}",
      "@types/react": "${packageJson.devDependencies['@types/react']}",
      "@types/react-dom": "${packageJson.devDependencies['@types/react-dom']}",
      "dayjs": "${packageJson.devDependencies['dayjs']}",
      "react": "${packageJson.devDependencies['react']}",
      "react-dom": "${packageJson.devDependencies['react-dom']}",
      "sass": "latest"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test --env=jsdom",
      "eject": "react-scripts eject"
    },
    "devDependencies": {
      "react-scripts": "latest"
    }
  }
  `,
    {
      '@laser-ui/components': `${lernaJson.version}`,
      '@laser-ui/hooks': `${lernaJson.version}`,
      '@laser-ui/themes': `${lernaJson.version}`,
      '@laser-ui/utils': `${lernaJson.version}`,
      '@types/react': `${packageJson.devDependencies['@types/react']}`,
      '@types/react-dom': `${packageJson.devDependencies['@types/react-dom']}`,
      dayjs: `${packageJson.devDependencies['dayjs']}`,
      react: `${packageJson.devDependencies['react']}`,
      'react-dom': `${packageJson.devDependencies['react-dom']}`,
      sass: 'latest',
    },
  ] as const;
}
