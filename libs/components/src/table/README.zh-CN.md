---
title: 表格
---

用于展示结构化数据的表格组件。

## API

### TableProps

```tsx
interface TableProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  ellipsis?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| border | 为 `true` 时，显示边框 | `false` |
| ellipsis | 为 `true` 时，全局启用文本省略 | `false` |
<!-- prettier-ignore-end -->

### Table.ThProps

```tsx
interface TableThProps extends BaseProps<'table', typeof CLASSES>, React.ThHTMLAttributes<HTMLTableCellElement> {
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  fixed?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  sort?: {
    options?: ('ascend' | 'descend' | null)[];
    active?: 'ascend' | 'descend' | null;
    defaultActive?: 'ascend' | 'descend' | null;
    onChange?: (order: 'ascend' | 'descend' | null) => void;
  };
  action?: React.ReactNode;
  ellipsis?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| width | 列宽 | - |
| align | 文本对齐方式 | - |
| fixed | 固定位置配置 | - |
| sort | 排序配置 | - |
| action | 自定义操作内容 | - |
| ellipsis | 为 `true` 时，启用文本省略 | - |
<!-- prettier-ignore-end -->

### Table.TdProps

```tsx
interface TableTdProps extends BaseProps<'table', typeof CLASSES>, React.TdHTMLAttributes<HTMLTableCellElement> {
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  fixed?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  ellipsis?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| width | 列宽 | - |
| align | 文本对齐方式 | - |
| fixed | 固定位置配置 | - |
| ellipsis | 为 `true` 时，启用文本省略 | - |
<!-- prettier-ignore-end -->

### Table.FilterProps

```tsx
interface TableFilterProps
  extends BaseProps<'table', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  children: (props: {
    id: string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactElement | false;
  visible?: boolean;
  placement?: PopupPlacement;
  placementFixed?: boolean;
  escClosable?: boolean;
  gap?: number;
  inWindow?: number | false;
  searchable?: boolean;
  searchValue?: string;
  modal?: boolean;
  destroyAfterClose?: boolean;
  zIndex?: number | string;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onReset?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| children | 触发器的渲染函数 | - |
| content | 筛选弹窗的内容 | - |
| footer | 筛选弹窗的底部 | - |
| visible | 受控的可见性 | - |
| placement | 弹窗位置 | - |
| placementFixed | 为 `true` 时，使用固定定位 | - |
| escClosable | 为 `true` 时，按 Esc 关闭 | - |
| gap | 触发器和弹窗之间的间隙 | - |
| inWindow | 窗口模式的滚动阈值 | - |
| searchable | 为 `true` 时，启用搜索 | - |
| searchValue | 受控的搜索值 | - |
| modal | 为 `true` 时，使用模态模式 | - |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | - |
| zIndex | 弹窗的 z-index | - |
| onVisibleChange | 可见性改变时的回调函数 | - |
| onSearch | 搜索值改变时的回调函数 | - |
| onReset | 重置时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
<!-- prettier-ignore-end -->

### Table.ThActionProps

```tsx
interface TableThActionProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  active?: boolean;
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| active | 为 `true` 时，操作处于激活状态 | - |
| disabled | 为 `true` 时，禁用操作 | - |
<!-- prettier-ignore-end -->

### Table.EmptyProps

```tsx
interface TableEmptyProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLTableRowElement> {
  colSpan?: number;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| colSpan | 跨越的列数 | - |
<!-- prettier-ignore-end -->

### Table.ExpandProps

```tsx
interface TableExpandProps
  extends BaseProps<'table', typeof CLASSES>,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  expand?: boolean;
  onExpandChange?: (expand: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| expand | 为 `true` 时，行展开 | - |
| onExpandChange | 展开状态改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  table: '^table',
  'table--border': '^table--border',
  table__cell: '^table__cell',
  'table__cell--left': '^table__cell--left',
  'table__cell--right': '^table__cell--right',
  'table__cell--center': '^table__cell--center',
  'table__cell--fixed-left': '^table__cell--fixed-left',
  'table__cell--fixed-right': '^table__cell--fixed-right',
  'table__cell--ellipsis': '^table__cell--ellipsis',
  'table__cell--th-sort': '^table__cell--th-sort',
  'table__cell-content': '^table__cell-content',
  'table__cell-text': '^table__cell-text',
  'table__th-actions': '^table__th-actions',
  'table__th-action': '^table__th-action',
  'table__th-action.is-active': 'is-active',
  'table__th-action.is-disabled': 'is-disabled',
  'table__th-action--sort': '^table__th-action--sort',
  'table__th-sort-icon': '^table__th-sort-icon',
  'table__th-sort-icon.is-active': 'is-active',
  table__filter: '^table__filter',
  table__empty: '^table__empty',
  'table__empty-content': '^table__empty-content',
  table__expand: '^table__expand',
  'table__expand.is-expand': 'is-expand',
};
```
