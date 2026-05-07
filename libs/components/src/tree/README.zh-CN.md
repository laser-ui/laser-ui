---
title: 树
---

展示树形结构数据，支持展开/折叠和选择。

## API

### TreeProps

```tsx
interface TreeItem<V extends React.Key> {
  label: string;
  value: V;
  loading?: boolean;
  disabled?: boolean;
  children?: TreeItem<V>[];
}

interface TreeProps<V extends React.Key, T extends TreeItem<V>> extends BaseProps<'tree', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  expands?: V[];
  defaultExpands?: V[];
  showLine?: boolean;
  multiple?: boolean;
  onlyLeafSelectable?: boolean;
  disabled?: boolean;
  virtual?: { listSize: number; listPadding: number; itemSize?: number };
  customItem?: (item: T) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onFirstExpand?: (value: V, origin: T) => void;
  onExpandsChange?: (values: V[], origins: T[]) => void;
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
| showLine | 为 `true` 时，显示连接线 | `false` |
| multiple | 为 `true` 时，开启多选 | `false` |
| onlyLeafSelectable | 为 `true` 时，仅叶子节点可选 | `true` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| virtual | 虚拟滚动配置 | - |
| customItem | 自定义选项渲染 | - |
| onModelChange | 选中值改变时的回调函数 | - |
| onFirstExpand | 节点首次展开时的回调函数 | - |
| onExpandsChange | 展开节点改变时的回调函数 | - |
| onScrollBottom | 滚动到底部时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  tree: '^tree',
  'tree.is-disabled': 'is-disabled',
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
