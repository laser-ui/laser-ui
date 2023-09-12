# FAQ

下面列出了一些常见问题：

## 组件库是否含有副作用

- `@laser-ui/themes` 中的 [reboot.scss](https://github.com/laser-ui/laser-ui/blob/main/libs/themes/reboot.scss) 覆盖了某些全局样式。

## 组件何时受控

我们约定 `undefined` 代表组件为非受控状态，其它值均代表组件受控。

## 受控组件空值一般是什么

受控组件空值一般定义为 `null`，实际情况请参考组件 API。

## 如何修改 dayjs 配置

项目应当使用全局唯一的 `dayjs`，所以组件库的 `dayjs` 是放在 `peerDependencies` 中。

您需要在您的项目中导入组件库的 [dayjs](https://github.com/laser-ui/laser-ui/blob/main/libs/components/src/dayjs.ts) 做配置修改。
