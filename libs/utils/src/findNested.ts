import { isArray, isUndefined } from 'lodash';

export function findNested<T>(arr: T[], predicate: (item: T) => boolean, arrNested = (item: T) => (item as any).children): T | undefined {
  let res: T | undefined;
  const reduceArr = (arr: T[]) => {
    for (const item of arr) {
      if (!isUndefined(res)) {
        break;
      }

      if (predicate(item)) {
        res = item;
      } else {
        const children = arrNested(item);
        if (isArray(children)) {
          reduceArr(children);
        }
      }
    }
  };
  reduceArr(arr);

  return res;
}
