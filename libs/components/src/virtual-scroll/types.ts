export {};

export type VirtualScrollOptimization<T = any> = Pick<
  VirtualScrollProps<T>,
  'list' | 'itemKey' | 'itemSize' | 'itemEmptySize' | 'itemNested' | 'itemFocusable' | 'itemExpand'
>;

export interface VirtualScrollRef<T> {
  scrollToItem: (el: HTMLElement, key: React.Key) => T | undefined;
  scrollToStep: (el: HTMLElement, step: 1 | -1) => T | undefined;
  scrollToNested: (el: HTMLElement) => T | undefined;
  scrollToStart: (el: HTMLElement) => T | undefined;
  scrollToEnd: (el: HTMLElement) => T | undefined;
}

export interface VirtualScrollProps<T> {
  children: (vsList: React.ReactNode, onScroll: React.UIEventHandler<HTMLElement>) => JSX.Element | null;
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
