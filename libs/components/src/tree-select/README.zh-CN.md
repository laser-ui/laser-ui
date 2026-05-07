---
title: 树选择框
---

从树形结构数据中选择值。

## API

### TreeSelectProps

```tsx
interface TreeSelectRef {
  updatePosition: () => void;
}

interface TreeSelectProps<V extends React.Key, T extends TreeItem<V>> extends BaseProps<'tree-select' | 'tree' | 'tree-select-popup', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<TreeSelectRef>;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  expands?: V[];
  defaultExpands?: V[];
  visible?: boolean;
  defaultVisible?: boolean;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onlyLeafSelectable?: boolean;
  showLine?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: Size;
  disabled?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  customItem?: (item: T) => React.ReactNode;
  customSelected?: (value: V, selected?: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  inputProps?: React.ComponentPropsWithRef<'input'>;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onFirstExpand?: (value: V, origin: T) => void;
  onExpandsChange?: (values: V[], origins: T[]) => void;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
  onScrollBottom?: () => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| list | 树形数据 | - |
| model | 选中的值 | `null` / `[]` |
| defaultModel | 默认选中的值 | `null` / `[]` |
| expands | 展开的节点值 | `[]` |
| defaultExpands | 默认展开的节点值 | `[]` |
| visible | 浮层是否可见 | `false` |
| defaultVisible | 浮层默认是否可见 | `false` |
| placeholder | 占位提示文字 | - |
| multiple | 为 `true` 时，开启多选 | `false` |
| searchable | 为 `true` 时，开启搜索 | `false` |
| searchValue | 搜索值 | `''` |
| defaultSearchValue | 默认搜索值 | `''` |
| onlyLeafSelectable | 为 `true` 时，仅叶子节点可选 | `true` |
| showLine | 为 `true` 时，显示连接线 | `false` |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| loading | 为 `true` 时，显示加载状态 | `false` |
| size | 大小 | `'medium'` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| virtual | 启用虚拟滚动，或设置项目高度 | `false` |
| escClosable | 为 `true` 时，按 Escape 键关闭浮层 | `true` |
| customItem | 自定义选项渲染 | - |
| customSelected | 自定义已选项显示 | - |
| customSearch | 自定义搜索过滤和排序 | - |
| inputProps | 输入元素的属性 | - |
| popupRender | 自定义浮层内容 | - |
| onModelChange | 选中值改变时的回调函数 | - |
| onFirstExpand | 节点首次展开时的回调函数 | - |
| onExpandsChange | 展开节点改变时的回调函数 | - |
| onVisibleChange | 浮层可见性改变时的回调函数 | - |
| onSearch | 搜索值改变时的回调函数 | - |
| onClear | 点击清除按钮时的回调函数 | - |
| afterVisibleChange | 浮层可见性动画完成后的回调函数 | - |
| onScrollBottom | 滚动到底部时的回调函数 | - |
<!-- prettier-ignore-end -->

### TreeSelectRef

```tsx
interface TreeSelectRef {
  updatePosition: () => void;
}
```

### CSS

```tsx
const CLASSES = {
  'tree-select': '^tree-select',
  'tree-select.is-expanded': 'is-expanded',
  'tree-select.is-disabled': 'is-disabled',
  'tree-select--small': '^tree-select--small',
  'tree-select--medium': '^tree-select--medium',
  'tree-select--large': '^tree-select--large',
  'tree-select__container': '^tree-select__container',
  'tree-select__content': '^tree-select__content',
  'tree-select__search': '^tree-select__search',
  'tree-select__placeholder-wrapper': '^tree-select__placeholder-wrapper',
  'tree-select__placeholder': '^tree-select__placeholder',
  'tree-select__multiple-count': '^tree-select__multiple-count',
  'tree-select__close': '^tree-select__close',
  'tree-select__clear': '^tree-select__clear',
  'tree-select__icon': '^tree-select__icon',
  'tree-select__arrow': '^tree-select__arrow',
  'tree-select-popup': '^tree-select-popup',
  'tree-select-popup__content': '^tree-select-popup__content',
  'tree-select-popup__loading': '^tree-select-popup__loading',
  'tree-select-popup__loading--empty': '^tree-select-popup__loading--empty',
  tree: '^tree',
  'tree--line': '^tree--line',
  tree__group: '^tree__group',
  'tree__group--root': '^tree__group--root',
  tree__option: '^tree__option',
  'tree__option.is-selected': 'is-selected',
  'tree__option.is-disabled': 'is-disabled',
  'tree__option--root': '^tree__option--root',
  'tree__option--first': '^tree__option--first',
  'tree__option-dot': '^tree__option-dot',
  'tree__option-icon': '^tree__option-icon',
  'tree__option-arrow': '^tree__option-arrow',
  'tree__option-arrow.is-expand': 'is-expand',
  'tree__option-checkbox': '^tree__option-checkbox',
  'tree__option-content': '^tree__option-content',
  tree__empty: '^tree__empty',
};
```
