---
title: 穿梭框
---

在两个列表之间转移项目。

## API

### TransferProps

```tsx
interface TransferItem<V extends React.Key> {
  label: string;
  value: V;
  disabled?: boolean;
}

interface TransferProps<V extends React.Key, T extends TransferItem<V>> extends BaseProps<'transfer', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  selected?: V[];
  defaultSelected?: V[];
  searchable?: boolean;
  searchValue?: [string, string];
  defaultSearchValue?: [string, string];
  title?: [React.ReactNode?, React.ReactNode?];
  loading?: [boolean?, boolean?];
  disabled?: boolean;
  virtual?: boolean | number;
  customItem?: (value: V, item?: T) => React.ReactNode;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  onModelChange?: (value: V[], item: T[]) => void;
  onSelectedChange?: (value: V[], item: T[]) => void;
  onSearch?: (value: [string, string]) => void;
  onScrollBottom?: (direction: 'left' | 'right') => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| list | 数据源 | - |
| model | 右侧面板选中的值 | `[]` |
| defaultModel | 右侧面板默认选中的值 | `[]` |
| selected | 用于转移的选中项 | `[]` |
| defaultSelected | 默认用于转移的选中项 | `[]` |
| searchable | 为 `true` 时，开启搜索 | `false` |
| searchValue | 两个面板的搜索值 | `['', '']` |
| defaultSearchValue | 默认搜索值 | `['', '']` |
| title | 两个面板的标题 | - |
| loading | 两个面板的加载状态 | `[false, false]` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| virtual | 启用虚拟滚动，或设置项目高度 | `false` |
| customItem | 自定义选项渲染 | - |
| customSearch | 自定义搜索过滤和排序 | - |
| onModelChange | 右侧面板值改变时的回调函数 | - |
| onSelectedChange | 选中项改变时的回调函数 | - |
| onSearch | 搜索值改变时的回调函数 | - |
| onScrollBottom | 滚动到底部时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  transfer: '^transfer',
  'transfer.is-disabled': 'is-disabled',
  transfer__panel: '^transfer__panel',
  transfer__actions: '^transfer__actions',
  transfer__header: '^transfer__header',
  'transfer__header-title': '^transfer__header-title',
  transfer__search: '^transfer__search',
  'transfer__list-container': '^transfer__list-container',
  transfer__list: '^transfer__list',
  transfer__loading: '^transfer__loading',
  transfer__option: '^transfer__option',
  'transfer__option.is-disabled': 'is-disabled',
  'transfer__option-prefix': '^transfer__option-prefix',
  'transfer__option-content': '^transfer__option-content',
};
```
