# 全局配置

通过我们的 `ConfigProvider` 组件，您可以非常方便的配置我们的组件库，下面列出了所有配置项：

```tsx
interface LContextData {
  namespace: string; // 需要同步修改 sass 变量！
  componentDisabled: boolean;
  componentSize: Size;
  componentDefaultProps: { [K in keyof ComponentProps]?: Partial<ComponentProps[K]> };
  layoutPageScrollEl: RefExtra | null;
  layoutContentResizeEl: RefExtra | null;
  listenGlobalScrolling: boolean;
}
```
