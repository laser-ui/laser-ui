---
group: Navigation
title: Pagination
---

A component for dividing content into multiple pages.

## API

### PaginationProps

```tsx
interface PaginationProps extends BaseProps<'pagination', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  total: number;
  active?: number;
  defaultActive?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeList?: number[];
  compose?: ('total' | 'pages' | 'page-size' | 'jump')[];
  customRender?: {
    total?: (range: [number, number]) => React.ReactNode;
    prev?: React.ReactNode;
    page?: (page: number) => React.ReactNode;
    next?: React.ReactNode;
    pageSize?: (pageSize: number) => React.ReactNode;
    jump?: (input: React.ReactNode) => React.ReactNode;
  };
  mini?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| total | The total number of items | - |
| active | The current page | `1` |
| defaultActive | The default current page | `1` |
| pageSize | The number of items per page | - |
| defaultPageSize | The default number of items per page | First item of `pageSizeList` |
| pageSizeList | The options for page size | `[10, 20, 50, 100]` |
| compose | The composition of the pagination | `['pages']` |
| customRender | Custom render functions | - |
| mini | If `true`, use the mini style | `false` |
| onChange | Callback fired when the page or page size changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  pagination: '^pagination',
  'pagination--mini': '^pagination--mini',
  pagination__row: '^pagination__row',
  pagination__jump: '^pagination__jump',
  pagination__button: '^pagination__button',
  'pagination__button.is-active': 'is-active',
  'pagination__button.is-disabled': 'is-disabled',
  'pagination__button--border': '^pagination__button--border',
  'pagination__button--number': '^pagination__button--number',
  'pagination__button--jump5': '^pagination__button--jump5',
  'pagination__jump5-icon': '^pagination__jump5-icon',
  pagination__ellipsis: '^pagination__ellipsis',
};
```
