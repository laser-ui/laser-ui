# 快速开始

## 安装

```bash
npm install @laser-ui/components @laser-ui/hooks @laser-ui/themes @laser-ui/utils
```

## 引入样式

出于打包体积以及按需引入的考虑，我们没有打包样式文件。

全局样式：

```scss
@use '@laser-ui/themes/index';
```

按需引入：

```scss
@use '@laser-ui/themes/root';

@use '@laser-ui/themes/reboot';
@use '@laser-ui/themes/animations';
@use '@laser-ui/themes/common';

@use '@laser-ui/themes/components/circular-progress';
@use '@laser-ui/themes/components/mask';
@use '@laser-ui/themes/components/wave';

@use '@laser-ui/themes/components/accordion';
```

## 演示

这里有一个简单的 Laser UI 组件的在线 codesandbox 演示：

<iframe
  src="https://codesandbox.io/embed/getting-started-3vkd3t?fontsize=14&hidenavigation=1&theme=dark"
  style="width: 100%; height: 500px; overflow: hidden; border: 0; border-radius: 4px"
  title="getting-started"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
