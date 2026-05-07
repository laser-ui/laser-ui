---
title: 分页
---

用于将内容分成多个页面的组件。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| total | 总条目数 | - |
| active | 当前页 | `1` |
| defaultActive | 默认当前页 | `1` |
| pageSize | 每页条目数 | - |
| defaultPageSize | 默认每页条目数 | `pageSizeList` 首项 |
| pageSizeList | 每页条目数选项 | `[10, 20, 50, 100]` |
| compose | 分页的组成 | `['pages']` |
| customRender | 自定义渲染函数 | - |
| mini | 为 `true` 时，使用迷你样式 | `false` |
| onChange | 页码或每页条目数改变时的回调函数 | - |
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
