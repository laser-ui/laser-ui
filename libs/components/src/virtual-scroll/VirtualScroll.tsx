import type { VirtualScrollProps } from './types';

import { useEventCallback } from '@laser-ui/hooks';
import { checkScrollEnd } from '@laser-ui/utils';
import { isBoolean, isNumber, isUndefined, nth } from 'lodash';
import { Fragment, createElement, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { EMPTY } from './vars';
import { useComponentProps } from '../hooks';

export function VirtualScroll<T>(props: VirtualScrollProps<T>): React.ReactElement | null {
  const {
    ref,
    children,
    enable = true,
    list,
    listSize,
    listPadding: listPaddingProp,
    itemKey,
    itemRender,
    itemSize: itemSizeProp,
    itemEmptySize: itemEmptySizeProp = 0,
    itemNested,
    itemEmptyRender,
    itemExpand,
    itemFocusable: itemFocusableProp = true,
    itemFocused,
    itemInAriaSetsize: itemInAriaSetsizeProp = true,
    placeholder,
    horizontal = false,
    onScrollEnd,
  } = useComponentProps('VirtualScroll', props);

  const listPadding = isNumber(listPaddingProp) ? [listPaddingProp, listPaddingProp] : listPaddingProp;

  const listSaved = useRef(new Map<React.Key, React.ReactNode[]>());

  const [_scrollPosition, setScrollPosition] = useState(0);
  const itemSize = useMemo(() => (isNumber(itemSizeProp) ? () => itemSizeProp : itemSizeProp), [itemSizeProp]);
  const itemEmptySize = useMemo(() => (isNumber(itemEmptySizeProp) ? () => itemEmptySizeProp : itemEmptySizeProp), [itemEmptySizeProp]);
  const itemFocusable = useMemo(() => (isBoolean(itemFocusableProp) ? () => itemFocusableProp : itemFocusableProp), [itemFocusableProp]);
  const itemInAriaSetsize = useMemo(
    () => (isBoolean(itemInAriaSetsizeProp) ? () => itemInAriaSetsizeProp : itemInAriaSetsizeProp),
    [itemInAriaSetsizeProp],
  );

  const [items, totalSize, firstFocusableItem, lastFocusableItem] = useMemo(() => {
    const items = new Map<React.Key, { item: T; level: number; accSize: number; nestedSize: number }>();
    let accSize = 0;
    let totalSize = 0;
    let firstFocusableItem: T | undefined;
    let lastFocusableItem: T | undefined;

    if (enable) {
      const reduceArr = (arr: T[], level = 0) => {
        let size = 0;
        for (const item of arr) {
          if (itemFocusable(item)) {
            lastFocusableItem = item;
            if (isUndefined(firstFocusableItem)) {
              firstFocusableItem = item;
            }
          }

          const key = itemKey(item);
          const _size = itemSize(item);
          size += _size;
          accSize += _size;

          const data = { item, level, accSize, nestedSize: 0 };
          items.set(key, data);

          const nestedData = itemNested?.(item);
          if (nestedData) {
            const expand = itemExpand ? itemExpand(item) : true;
            if (expand) {
              if (nestedData.length === 0) {
                data.nestedSize = itemEmptySize(item);
                size += data.nestedSize;
                accSize += data.nestedSize;
              } else {
                data.nestedSize = reduceArr(nestedData, level + 1);
                size += data.nestedSize;
              }
            }
          }
        }
        return size;
      };
      totalSize = reduceArr(list);
    } else {
      const reduceArr = (arr: T[], level = 0) => {
        for (const item of arr) {
          if (itemFocusable(item)) {
            lastFocusableItem = item;
            if (isUndefined(firstFocusableItem)) {
              firstFocusableItem = item;
            }
          }

          const key = itemKey(item);

          const data = { item, level, accSize, nestedSize: 0 };
          items.set(key, data);

          const nestedData = itemNested?.(item);
          if (nestedData) {
            const expand = itemExpand ? itemExpand(item) : true;
            if (expand) {
              if (nestedData.length > 0) {
                reduceArr(nestedData, level + 1);
              }
            }
          }
        }
      };
      reduceArr(list);
    }

    return [items, totalSize, firstFocusableItem, lastFocusableItem];
  }, [enable, itemEmptySize, itemExpand, itemFocusable, itemKey, itemNested, itemSize, list]);

  const vsList = (() => {
    if (enable) {
      const maxScrollSize = Math.max(totalSize + listPadding[0] + listPadding[1] - listSize, 0);
      const scrollPosition = Math.min(_scrollPosition, maxScrollSize);

      let totalAccSize = 0;
      const startSize = scrollPosition - listSize - listPadding[0];
      const endSize = scrollPosition + listSize * 2 - listPadding[0];

      let hasStart = false;
      let hasEnd = false;
      const getList = (arr: (T | typeof EMPTY)[], ancestry: T[] = []): React.ReactNode[] => {
        const fillSize = [0, 0];
        const list: React.ReactNode[] = [];
        const ariaSetsize = arr.filter((item) => {
          if (item === EMPTY) {
            return false;
          }
          return itemInAriaSetsize(item);
        }).length;

        for (const [index, item] of arr.entries()) {
          let size = 0;
          let listNestedSize = 0;
          let key!: React.Key;
          let nestedData: T[] | undefined;
          let emptyNode: React.ReactNode;
          if (item === EMPTY) {
            const parentNestedData = itemNested?.(ancestry[ancestry.length - 1]);
            if (parentNestedData) {
              size = itemEmptySize(ancestry[ancestry.length - 1]);
              emptyNode = <Fragment key="$$empty">{itemEmptyRender?.(ancestry[ancestry.length - 1])}</Fragment>;
            }
          } else {
            key = itemKey(item);
            size = itemSize(item);
            nestedData = itemNested?.(item);
            if (nestedData) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              listNestedSize = items.get(key)!.nestedSize;
            }
          }

          if (hasEnd) {
            fillSize[1] += size + listNestedSize;
            continue;
          }

          totalAccSize += size;
          if (nestedData) {
            if (totalAccSize + listNestedSize > startSize) {
              const expand = itemExpand ? itemExpand(item as T) : undefined;
              let childrenList: React.ReactNode[] = [];
              if (isUndefined(expand)) {
                childrenList = getList(nestedData.length === 0 ? [EMPTY] : nestedData, ancestry.concat([item as T]));
              } else {
                childrenList = listSaved.current.get(key) ?? [];
                if (expand) {
                  childrenList = getList(nestedData.length === 0 ? [EMPTY] : nestedData, ancestry.concat([item as T]));
                  listSaved.current.set(key, childrenList);
                }
              }

              list.push(
                itemRender(
                  item as T,
                  index,
                  {
                    'aria-level': ancestry.length + 1,
                    'aria-setsize': ariaSetsize,
                    'aria-posinset': index + 1,
                  },
                  ancestry,
                  childrenList,
                ),
              );
            } else {
              totalAccSize += listNestedSize;
              fillSize[0] += size + listNestedSize;
            }
          } else if (!hasStart) {
            if (totalAccSize > startSize) {
              list.push(
                item === EMPTY
                  ? emptyNode
                  : itemRender(
                      item,
                      index,
                      {
                        'aria-level': ancestry.length + 1,
                        'aria-setsize': ariaSetsize,
                        'aria-posinset': index + 1,
                      },
                      ancestry,
                    ),
              );
              hasStart = true;
            } else {
              fillSize[0] += size;
            }
          } else if (!hasEnd) {
            if (totalAccSize > endSize) {
              hasEnd = true;
              fillSize[1] += size;
            } else {
              list.push(
                item === EMPTY
                  ? emptyNode
                  : itemRender(
                      item,
                      index,
                      {
                        'aria-level': ancestry.length + 1,
                        'aria-setsize': ariaSetsize,
                        'aria-posinset': index + 1,
                      },
                      ancestry,
                    ),
              );
            }
          }
        }

        if (fillSize[0] > 0) {
          list.unshift(
            createElement(placeholder, {
              key: '$$fill-size-0',
              style: {
                display: horizontal ? 'inline-block' : 'block',
                overflow: 'hidden',
                width: horizontal ? fillSize[0] : 0,
                height: horizontal ? 0 : fillSize[0],
                flexShrink: 0,
              },
              'aria-hidden': true,
            }),
          );
        }
        if (fillSize[1] > 0) {
          list.push(
            createElement(placeholder, {
              key: '$$fill-size-1',
              style: {
                display: horizontal ? 'inline-block' : 'block',
                overflow: 'hidden',
                width: horizontal ? fillSize[1] : 0,
                height: horizontal ? 0 : fillSize[1],
                flexShrink: 0,
              },
              'aria-hidden': true,
            }),
          );
        }

        return list;
      };

      return getList(list);
    } else {
      const getList = (arr: (T | typeof EMPTY)[], ancestry: T[] = []): React.ReactNode[] => {
        const list: React.ReactNode[] = [];
        const ariaSetsize = arr.filter((item) => {
          if (item === EMPTY) {
            return false;
          }
          return itemInAriaSetsize(item);
        }).length;

        for (const [index, item] of arr.entries()) {
          let key!: React.Key;
          let nestedData: T[] | undefined;
          let emptyNode: React.ReactNode;
          if (item === EMPTY) {
            const parentNestedData = itemNested?.(ancestry[ancestry.length - 1]);
            if (parentNestedData) {
              emptyNode = <Fragment key="$$empty">{itemEmptyRender?.(ancestry[ancestry.length - 1])}</Fragment>;
            }
          } else {
            key = itemKey(item);
            nestedData = itemNested?.(item);
          }

          if (nestedData) {
            const expand = itemExpand ? itemExpand(item as T) : undefined;
            let childrenList: React.ReactNode[] = [];
            if (isUndefined(expand)) {
              childrenList = getList(nestedData.length === 0 ? [EMPTY] : nestedData, ancestry.concat([item as T]));
            } else {
              childrenList = listSaved.current.get(key) ?? [];
              if (expand) {
                childrenList = getList(nestedData.length === 0 ? [EMPTY] : nestedData, ancestry.concat([item as T]));
                listSaved.current.set(key, childrenList);
              }
            }

            list.push(
              itemRender(
                item as T,
                index,
                {
                  'aria-level': ancestry.length + 1,
                  'aria-setsize': ariaSetsize,
                  'aria-posinset': index + 1,
                },
                ancestry,
                childrenList,
              ),
            );
          } else {
            list.push(
              item === EMPTY
                ? emptyNode
                : itemRender(
                    item,
                    index,
                    {
                      'aria-level': ancestry.length + 1,
                      'aria-setsize': ariaSetsize,
                      'aria-posinset': index + 1,
                    },
                    ancestry,
                  ),
            );
          }
        }

        return list;
      };

      return getList(list);
    }
  })();

  const scrollTo = (el: HTMLElement, num: number) => {
    el[horizontal ? 'scrollLeft' : 'scrollTop'] = num;
  };

  const scrollToItem = useEventCallback((el: HTMLElement, key: React.Key) => {
    const findItem = items.get(key);

    if (enable && !isUndefined(findItem)) {
      scrollTo(el, findItem.accSize - itemSize(findItem.item) + listPadding[0]);
    }

    return findItem?.item;
  });

  const scrollToStart = useEventCallback((el: HTMLElement) => {
    if (enable) {
      scrollTo(el, 0);
    }

    return firstFocusableItem;
  });

  const scrollToEnd = useEventCallback((el: HTMLElement) => {
    if (enable) {
      scrollTo(el, el[horizontal ? 'scrollWidth' : 'scrollHeight']);
    }

    return lastFocusableItem;
  });

  const scrollToStep = useEventCallback((el: HTMLElement, step: 1 | -1) => {
    if (isUndefined(itemFocused)) {
      return;
    }

    let findItem: T | undefined;
    let offsetSize: [number, number] | undefined;

    let index = -1;
    let findIndex = -1;
    const accSizeList = [];
    for (const iterator of items) {
      index += 1;
      if (iterator[0] === itemFocused) {
        findIndex = index;
      }
      accSizeList.push(iterator[1]);
    }

    if (findIndex !== -1) {
      if (step === 1) {
        for (let index = findIndex + 1, n = 0; n < accSizeList.length; index++, n++) {
          const accSizeItem = nth(accSizeList, index % accSizeList.length);
          if (accSizeItem && itemFocusable(accSizeItem.item)) {
            findItem = accSizeItem.item;
            if (enable) {
              offsetSize = [accSizeItem.accSize - itemSize(findItem) + listPadding[0], accSizeItem.accSize + listPadding[0]];
            }
            break;
          }
        }
      } else {
        for (let index = findIndex - 1, n = 0; n < accSizeList.length; index--, n++) {
          const accSizeItem = nth(accSizeList, index);
          if (accSizeItem && itemFocusable(accSizeItem.item)) {
            findItem = accSizeItem.item;
            if (enable) {
              offsetSize = [accSizeItem.accSize - itemSize(findItem) + listPadding[0], accSizeItem.accSize + listPadding[0]];
            }
            break;
          }
        }
      }
    }

    if (!isUndefined(offsetSize)) {
      const listElScrollPosition = el[horizontal ? 'scrollLeft' : 'scrollTop'];
      const listElClientSize = el[horizontal ? 'clientWidth' : 'clientHeight'];
      if (listElScrollPosition > offsetSize[1]) {
        scrollTo(el, offsetSize[0] - listPadding[0]);
      } else if (offsetSize[0] > listElScrollPosition + listElClientSize) {
        scrollTo(el, offsetSize[1] - listElClientSize + listPadding[0]);
      } else {
        if (step === 1) {
          if (offsetSize[1] > listElScrollPosition + listElClientSize) {
            scrollTo(el, offsetSize[1] - listElClientSize + listPadding[0]);
          }
        } else {
          if (listElScrollPosition > offsetSize[0]) {
            scrollTo(el, offsetSize[0] - listPadding[0]);
          }
        }
      }
    }

    return findItem;
  });

  const scrollToNested = useEventCallback((el: HTMLElement) => {
    if (isUndefined(itemFocused)) {
      return;
    }

    let findItem: T | undefined;
    let offsetSize: [number, number] | undefined;

    let index = -1;
    let findIndex = -1;
    let level = 0;
    const accSizeList = [];
    for (const iterator of items) {
      index += 1;
      if (iterator[0] === itemFocused) {
        findIndex = index;
        level = iterator[1].level;
      }
      accSizeList.push(iterator[1]);
    }

    if (findIndex !== -1) {
      for (let index = findIndex + 1; index < accSizeList.length; index++) {
        const accSizeItem = accSizeList[index];
        if (accSizeItem.level <= level) {
          return;
        }
        if (itemFocusable(accSizeItem.item)) {
          findItem = accSizeItem.item;
          if (enable) {
            offsetSize = [accSizeItem.accSize - itemSize(findItem) + listPadding[0], accSizeItem.accSize + listPadding[0]];
          }
          break;
        }
      }
    }

    if (!isUndefined(offsetSize)) {
      const listElScrollPosition = el[horizontal ? 'scrollLeft' : 'scrollTop'];
      const listElClientSize = el[horizontal ? 'clientWidth' : 'clientHeight'];
      if (listElScrollPosition > offsetSize[1]) {
        scrollTo(el, offsetSize[0] - listPadding[0]);
      } else if (offsetSize[0] > listElScrollPosition + listElClientSize) {
        scrollTo(el, offsetSize[1] - listElClientSize + listPadding[0]);
      } else {
        if (offsetSize[1] > listElScrollPosition + listElClientSize) {
          scrollTo(el, offsetSize[1] - listElClientSize + listPadding[0]);
        }
      }
    }
    return findItem;
  });

  useImperativeHandle(
    ref,
    () => ({
      scrollToItem,
      scrollToStep,
      scrollToNested,
      scrollToStart,
      scrollToEnd,
    }),
    [scrollToItem, scrollToStep, scrollToNested, scrollToStart, scrollToEnd],
  );

  return children(vsList, (e) => {
    setScrollPosition(e.currentTarget[horizontal ? 'scrollLeft' : 'scrollTop']);
    if (checkScrollEnd(e.currentTarget)[horizontal ? 'x' : 'y']) {
      onScrollEnd?.();
    }
  });
}
