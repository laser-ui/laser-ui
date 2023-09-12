# Global configuration

Through our `ConfigProvider` component, you can configure our component library very conveniently. All configuration items are listed below:

```tsx
interface LContextData {
  namespace: string; // Sass variables need to be modified synchronously!
  componentDisabled: boolean;
  componentSize: Size;
  componentDefaultProps: { [K in keyof ComponentProps]?: Partial<ComponentProps[K]> };
  layoutPageScrollEl: RefExtra | null;
  layoutContentResizeEl: RefExtra | null;
  listenGlobalScrolling: boolean;
}
```
