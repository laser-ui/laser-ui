---
group: General
title: VirtualScroll
---

Render large lists efficiently by only rendering visible items.

## API

### VirtualScrollProps

```tsx
interface VirtualScrollProps<T> {
  ref?: React.Ref<VirtualScrollRef<T>>;
  children: (vsList: React.ReactNode, onScroll: React.UIEventHandler<HTMLElement>) => React.ReactElement | null;
  enable?: boolean;
  list: T[];
  listSize: number;
  listPadding: number | [number, number];
  itemKey: (item: T) => React.Key;
  itemRender: (
    item: T,
    index: number,
    props: {
      'aria-level': number;
      'aria-setsize': number;
      'aria-posinset': number;
    },
    ancestry: T[],
    children?: React.ReactNode,
  ) => React.ReactNode;
  itemSize: number | ((item: T) => number);
  itemEmptySize?: number | ((item: T) => number);
  itemNested?: (item: T) => T[] | undefined;
  itemEmptyRender?: (item: T) => React.ReactNode;
  itemExpand?: (item: T) => boolean | undefined;
  itemFocusable?: boolean | ((item: T) => boolean);
  itemFocused?: React.Key;
  itemInAriaSetsize?: boolean | ((item: T) => boolean);
  placeholder: string;
  horizontal?: boolean;
  onScrollEnd?: () => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| children | Render prop receiving the virtual list and scroll handler | required |
| enable | Whether virtual scrolling is enabled | `true` |
| list | The data list | required |
| listSize | The size of the scrollable list area | required |
| listPadding | Padding at the top and bottom of the list | required |
| itemKey | Unique key for each item | required |
| itemRender | Render function for each item | required |
| itemSize | Height (or width if horizontal) of each item | required |
| itemEmptySize | Size of empty/placeholder items | - |
| itemNested | Function to get nested children of an item | - |
| itemEmptyRender | Render function for empty items | - |
| itemExpand | Function to determine if an item is expanded | - |
| itemFocusable | Whether items are focusable | `true` |
| itemFocused | The currently focused item key | - |
| itemInAriaSetsize | Whether to include item in aria-setsize | `true` |
| placeholder | Placeholder text when the list is empty | required |
| horizontal | If `true`, use horizontal scrolling | `false` |
| onScrollEnd | Callback when scrolling to the end | - |
<!-- prettier-ignore-end -->

### VirtualScrollRef

```tsx
interface VirtualScrollRef<T> {
  scrollToItem: (el: HTMLElement, key: React.Key) => T | undefined;
  scrollToStep: (el: HTMLElement, step: 1 | -1) => T | undefined;
  scrollToNested: (el: HTMLElement) => T | undefined;
  scrollToStart: (el: HTMLElement) => T | undefined;
  scrollToEnd: (el: HTMLElement) => T | undefined;
}
```

| Method | Description |
| --- | --- |
| scrollToItem | Scroll to a specific item by key |
| scrollToStep | Scroll by a step of items |
| scrollToNested | Scroll to the nested items area |
| scrollToStart | Scroll to the start of the list |
| scrollToEnd | Scroll to the end of the list |
