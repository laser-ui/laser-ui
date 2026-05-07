---
group: Data Display
title: Table
aria: table
---

A table component for displaying structured data.

## API

### TableProps

```tsx
interface TableProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  ellipsis?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| border | If `true`, show borders | `false` |
| ellipsis | If `true`, enable text ellipsis globally | `false` |
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
| Property | Description | Default |
| --- | --- | --- |
| width | The width of the column | - |
| align | Text alignment | - |
| fixed | Fixed position configuration | - |
| sort | Sort configuration | - |
| action | Custom action content | - |
| ellipsis | If `true`, enable text ellipsis | - |
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
| Property | Description | Default |
| --- | --- | --- |
| width | The width of the column | - |
| align | Text alignment | - |
| fixed | Fixed position configuration | - |
| ellipsis | If `true`, enable text ellipsis | - |
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
| Property | Description | Default |
| --- | --- | --- |
| children | Render function for the trigger | - |
| content | The content of the filter popup | - |
| footer | The footer of the filter popup | - |
| visible | Controlled visibility | - |
| placement | Popup placement | - |
| placementFixed | If `true`, use fixed positioning | - |
| escClosable | If `true`, close on Escape key | - |
| gap | Gap between trigger and popup | - |
| inWindow | Scroll threshold for window mode | - |
| searchable | If `true`, enable search | - |
| searchValue | Controlled search value | - |
| modal | If `true`, use modal mode | - |
| destroyAfterClose | If `true`, destroy content after close | - |
| zIndex | The z-index of the popup | - |
| onVisibleChange | Callback fired when visibility changes | - |
| onSearch | Callback fired when search value changes | - |
| onReset | Callback fired when reset | - |
| afterVisibleChange | Callback fired after visibility changes | - |
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
| Property | Description | Default |
| --- | --- | --- |
| active | If `true`, the action is active | - |
| disabled | If `true`, disable the action | - |
<!-- prettier-ignore-end -->

### Table.EmptyProps

```tsx
interface TableEmptyProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLTableRowElement> {
  colSpan?: number;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| colSpan | The number of columns to span | - |
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
| Property | Description | Default |
| --- | --- | --- |
| expand | If `true`, the row is expanded | - |
| onExpandChange | Callback fired when expand state changes | - |
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
