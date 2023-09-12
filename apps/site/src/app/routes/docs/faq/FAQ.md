# FAQ

Listed below are some frequently asked questions:

## Does the component library contain side effects?

- [reboot.scss](https://github.com/laser-ui/laser-ui/blob/main/libs/themes/reboot.scss) in `@laser-ui/themes` overrides some globals style.

## When is the component controlled?

We agree that `undefined` means that the component is in an uncontrolled state, and other values ​​represent that the component is controlled.

## What is the general null value of a controlled component?

The null value of a controlled component is generally defined as `null`. For actual conditions, please refer to the component API.

## How to modify dayjs configuration

The project should use the globally unique `dayjs`, so the `dayjs` of the component library is placed in `peerDependencies`.

You need to import [dayjs](https://github.com/laser-ui/laser-ui/blob/main/libs/components/src/dayjs.ts) of the component library into your project to make configuration changes.
