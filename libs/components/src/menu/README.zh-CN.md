---
title: 导航菜单
---

用于组织和展示层级内容的导航菜单。

## API

### MenuItem

```tsx
interface MenuItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  type: 'item' | 'group' | 'sub';
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem<ID>[];
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| id | 唯一标识符 | - |
| title | 显示标题 | - |
| type | 菜单项类型 | - |
| icon | 图标元素 | - |
| disabled | 为 `true` 时，禁用该项 | `false` |
| children | 子菜单项 | - |
<!-- prettier-ignore-end -->

### MenuProps

```tsx
interface MenuProps<ID extends React.Key, T extends MenuItem<ID>> extends BaseProps<'menu' | 'menu-popup', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  ref?: React.Ref<MenuRef>;
  list: T[];
  mode?: MenuMode;
  width?: string | number;
  active?: ID | null;
  defaultActive?: ID;
  expands?: ID[];
  defaultExpands?: ID[];
  expandOne?: boolean;
  expandTrigger?: 'hover' | 'click';
  escClosable?: boolean;
  onActiveChange?: (id: ID, origin: T) => void;
  onExpandsChange?: (ids: ID[], origins: T[]) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| list | 菜单数据 | - |
| mode | 菜单模式 | `'vertical'` |
| width | 菜单宽度 | `'auto'` |
| active | 激活项 | `null` |
| defaultActive | 默认激活项 | `null` |
| expands | 展开的项 | `[]` |
| defaultExpands | 默认展开的项 | `[]` |
| expandOne | 为 `true` 时，同时只能展开一项 | `false` |
| expandTrigger | 展开子菜单的触发方式 | vertical 为 `'click'`，其他为 `'hover'` |
| escClosable | 为 `true` 时，按 Esc 键关闭弹出菜单 | `true` |
| onActiveChange | 激活项改变时的回调函数 | - |
| onExpandsChange | 展开项改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  menu: '^menu',
  'menu--horizontal': '^menu--horizontal',
  menu__item: '^menu__item',
  'menu__item--item': '^menu__item--item',
  'menu__item--sub': '^menu__item--sub',
  'menu__item--horizontal': '^menu__item--horizontal',
  'menu__item--icon': '^menu__item--icon',
  'menu__item.is-active': 'is-active',
  'menu__item.is-expand': 'is-expand',
  'menu__item.is-disabled': 'is-disabled',
  'menu__item-icon': '^menu__item-icon',
  'menu__item-content': '^menu__item-content',
  'menu__group-list': '^menu__group-list',
  'menu__group-title': '^menu__group-title',
  'menu__sub-list': '^menu__sub-list',
  'menu__sub-arrow': '^menu__sub-arrow',
  'menu__sub-arrow--horizontal': '^menu__sub-arrow--horizontal',
  'menu__sub-arrow.is-expand': 'is-expand',
  menu__indicator: '^menu__indicator',
  'menu__indicator--first': '^menu__indicator--first',
  'menu__indicator--last': '^menu__indicator--last',
  'menu__indicator-track': '^menu__indicator-track',
  'menu__indicator-track--hidden': '^menu__indicator-track--hidden',
  'menu__indicator-thumb': '^menu__indicator-thumb',
  menu__empty: '^menu__empty',
  'menu-popup': '^menu-popup',
};
```
