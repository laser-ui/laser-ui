---
title: 下拉菜单
---

用于显示可由按钮触发的选项列表。

## API

### DropdownProps

```tsx
interface DropdownItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  type: 'item' | 'group' | 'sub';
  icon?: React.ReactNode;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  separator?: boolean;
  children?: DropdownItem<ID>[];
}

interface DropdownProps<ID extends React.Key, T extends DropdownItem<ID>>
  extends BaseProps<'dropdown' | 'dropdown-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  ref?: React.Ref<DropdownRef>;
  children: (props: {
    id: string;
    tabIndex: number;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
    'aria-controls': string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onFocus: React.FocusEventHandler<HTMLElement>;
    onBlur: React.FocusEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  list: T[];
  visible?: boolean;
  defaultVisible?: boolean;
  trigger?: 'hover' | 'click';
  placement?: VerticalSidePlacement;
  placementFixed?: boolean;
  arrow?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  zIndex?: number | string;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
  onClick?: (id: ID, origin: T) => void | false;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| children | 触发元素的渲染函数 | - |
| list | 下拉选项 | - |
| visible | 下拉菜单是否可见 | - |
| defaultVisible | 下拉菜单默认是否可见 | `false` |
| trigger | 触发模式 | `'hover'` |
| placement | 下拉菜单的位置 | `'bottom-right'` |
| placementFixed | 为 `true` 时，位置固定 | `false` |
| arrow | 为 `true` 时，显示箭头 | `false` |
| virtual | 为 `true` 时，启用虚拟滚动，或设置项目高度 | `false` |
| escClosable | 为 `true` 时，按 Esc 键关闭下拉菜单 | `true` |
| zIndex | 下拉菜单的 z-index | - |
| popupRender | 弹出框的自定义渲染函数 | - |
| onVisibleChange | 可见性改变时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
| onClick | 点击选项时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  dropdown: '^dropdown',
  'dropdown--top': '^dropdown--top',
  'dropdown--top-left': '^dropdown--top-left',
  'dropdown--top-right': '^dropdown--top-right',
  'dropdown--bottom': '^dropdown--bottom',
  'dropdown--bottom-left': '^dropdown--bottom-left',
  'dropdown--bottom-right': '^dropdown--bottom-right',
  dropdown__item: '^dropdown__item',
  'dropdown__item.t-primary': 't-primary',
  'dropdown__item.t-success': 't-success',
  'dropdown__item.t-warning': 't-warning',
  'dropdown__item.t-danger': 't-danger',
  'dropdown__item--item': '^dropdown__item--item',
  'dropdown__item--sub': '^dropdown__item--sub',
  'dropdown__item.is-expand': 'is-expand',
  'dropdown__item.is-disabled': 'is-disabled',
  'dropdown__item-icon': '^dropdown__item-icon',
  'dropdown__item-content': '^dropdown__item-content',
  'dropdown__group-list': '^dropdown__group-list',
  'dropdown__group-title': '^dropdown__group-title',
  'dropdown__group-title.t-primary': 't-primary',
  'dropdown__group-title.t-success': 't-success',
  'dropdown__group-title.t-warning': 't-warning',
  'dropdown__group-title.t-danger': 't-danger',
  'dropdown__sub-arrow': '^dropdown__sub-arrow',
  dropdown__list: '^dropdown__list',
  dropdown__empty: '^dropdown__empty',
  dropdown__arrow: '^dropdown__arrow',
  'dropdown-popup': '^dropdown-popup',
};
```
