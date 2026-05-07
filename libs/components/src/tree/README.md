---
group: Data Entry
title: Tree
aria: treeview
virtual-scroll: true
---

Display a tree-structured data set with expand/collapse and selection.

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
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| list | The tree data | - |
| model | The selected value(s) | `null` / `[]` |
| defaultModel | The default selected value(s) | `null` / `[]` |
| expands | The expanded node values | `[]` |
| defaultExpands | The default expanded node values | `[]` |
| showLine | If `true`, show connecting lines | `false` |
| multiple | If `true`, enable multiple selection | `false` |
| onlyLeafSelectable | If `true`, only leaf nodes can be selected | `true` |
| disabled | If `true`, disable the component | `false` |
| virtual | Virtual scroll configuration | - |
| customItem | Customize the option rendering | - |
| onModelChange | Callback fired when the selected value changes | - |
| onFirstExpand | Callback fired when a node is first expanded | - |
| onExpandsChange | Callback fired when expanded nodes change | - |
| onScrollBottom | Callback fired when scrolling to the bottom | - |
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
