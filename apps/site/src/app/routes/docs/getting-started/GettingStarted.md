# Getting Started

## Installation

```bash
npm install @laser-ui/components @laser-ui/hooks @laser-ui/themes @laser-ui/utils
```

## Import style

For the sake of packing volume and importing on demand, we do not pack style files.

Global style:

```scss
@use '@laser-ui/themes/index';
```

Import on demand:

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

## Demo

Here's a simple online codesandbox demo of the Laser UI component:

<iframe
  src="https://codesandbox.io/embed/getting-started-3vkd3t?fontsize=14&hidenavigation=1&theme=dark"
  style="width: 100%; height: 500px; overflow: hidden; border: 0; border-radius: 4px"
  title="getting-started"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
