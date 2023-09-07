import type { MenuItem } from './types';

export function checkEnableItem<ID extends React.Key, T extends MenuItem<ID>>(item: T) {
  return (item.type === 'item' || item.type === 'sub') && !item.disabled;
}

export function getSameLevelEnableItems<ID extends React.Key, T extends MenuItem<ID>>(arr: T[]) {
  const items: T[] = [];
  const reduceArr = (arr: T[]) => {
    for (const item of arr) {
      if (item.type === 'group' && item.children) {
        reduceArr(item.children as T[]);
      } else if (checkEnableItem(item)) {
        items.push(item);
      }
    }
  };
  reduceArr(arr);
  return items;
}
