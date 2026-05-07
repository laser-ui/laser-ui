---
title: 页签面板
---

用于在不同内容面板之间切换的页签组件。

## API

### TabsProps

```tsx
interface TabsRef {
  updateIndicator: () => void;
}

interface TabsItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  panel: React.ReactNode;
  dropdownRender?: React.ReactNode;
  closable?: boolean;
  disabled?: boolean;
}

interface TabsProps<ID extends React.Key, T extends TabsItem<ID>>
  extends BaseProps<'tabs', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<TabsRef>;
  list: T[];
  active?: ID;
  defaultActive?: ID;
  pattern?: 'wrap' | 'slider';
  placement?: 'top' | 'right' | 'bottom' | 'left';
  center?: boolean;
  size?: Size;
  addible?: boolean;
  lazyLoading?: boolean;
  onActiveChange?: (id: ID, origin: T) => void;
  onAddClick?: () => void;
  onClose?: (id: ID, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| list | 页签数据列表 | - |
| active | 当前激活的页签 | - |
| defaultActive | 默认激活的页签 | 第一个非禁用页签 |
| pattern | 页签的形态 | - |
| placement | 页签列表的位置 | `'top'` |
| center | 为 `true` 时，页签居中 | `false` |
| size | 大小 | `'medium'` |
| addible | 为 `true` 时，显示添加按钮 | `false` |
| lazyLoading | 为 `true` 时，懒加载面板内容 | `true` |
| onActiveChange | 激活页签改变时的回调函数 | - |
| onAddClick | 点击添加按钮时的回调函数 | - |
| onClose | 关闭页签时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  tabs: '^tabs',
  'tabs--wrap': '^tabs--wrap',
  'tabs--slider': '^tabs--slider',
  'tabs--top': '^tabs--top',
  'tabs--right': '^tabs--right',
  'tabs--bottom': '^tabs--bottom',
  'tabs--left': '^tabs--left',
  'tabs--small': '^tabs--small',
  'tabs--medium': '^tabs--medium',
  'tabs--large': '^tabs--large',
  'tabs--center': '^tabs--center',
  'tabs__tablist-wrapper': '^tabs__tablist-wrapper',
  tabs__tablist: '^tabs__tablist',
  tabs__tab: '^tabs__tab',
  'tabs__tab.is-active': 'is-active',
  'tabs__tab.is-disabled': 'is-disabled',
  'tabs__tab--first': '^tabs__tab--first',
  'tabs__tab--last': '^tabs__tab--last',
  tabs__close: '^tabs__close',
  'tabs__button-container': '^tabs__button-container',
  tabs__button: '^tabs__button',
  'tabs__button.is-end': 'is-end',
  'tabs__button--more': '^tabs__button--more',
  'tabs__button--add': '^tabs__button--add',
  tabs__indicator: '^tabs__indicator',
  'tabs__wrap-indicator': '^tabs__wrap-indicator',
  'tabs__slider-indicator': '^tabs__slider-indicator',
  tabs__tabpanel: '^tabs__tabpanel',
};
```
