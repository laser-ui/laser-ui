---
title: 虚拟滚动
---

通过只渲染可见项来高效渲染大数据列表。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| children | 接收虚拟列表和滚动处理函数的 render prop | 必填 |
| enable | 是否启用虚拟滚动 | `true` |
| list | 数据列表 | 必填 |
| listSize | 可滚动列表区域的大小 | 必填 |
| listPadding | 列表顶部和底部的内边距 | 必填 |
| itemKey | 每项的唯一标识 | 必填 |
| itemRender | 每项的渲染函数 | 必填 |
| itemSize | 每项的高度（水平滚动时为宽度） | 必填 |
| itemEmptySize | 空项/占位项的大小 | - |
| itemNested | 获取项嵌套子项的函数 | - |
| itemEmptyRender | 空项的渲染函数 | - |
| itemExpand | 判断项是否展开的函数 | - |
| itemFocusable | 项是否可聚焦 | `true` |
| itemFocused | 当前聚焦的项的 key | - |
| itemInAriaSetsize | 是否将项包含在 aria-setsize 中 | `true` |
| placeholder | 列表为空时的占位文本 | 必填 |
| horizontal | 为 `true` 时，使用水平滚动 | `false` |
| onScrollEnd | 滚动到底部时的回调 | - |
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

| 方法 | 说明 |
| --- | --- |
| scrollToItem | 滚动到指定 key 的项 |
| scrollToStep | 按步长滚动 |
| scrollToNested | 滚动到嵌套子项区域 |
| scrollToStart | 滚动到列表开头 |
| scrollToEnd | 滚动到列表末尾 |
