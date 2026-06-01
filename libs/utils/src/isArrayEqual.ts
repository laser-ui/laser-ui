const isSameValueZero = (a: any, b: any) => a === b || (Number.isNaN(a) && Number.isNaN(b));

export interface CompareOptions {
  /**
   * Whether to ignore element order (default false)
   * When enabled: [1, 2] is treated as equal to [2, 1]
   */
  ignoreOrder?: boolean;

  /**
   * Whether to ignore duplicate elements (default false)
   * When enabled: [1, 2, 2] is treated as equal to [1, 2]
   *
   * - `ignoreDuplicates: true` + `ignoreOrder: true` — compares as unordered sets
   * - `ignoreDuplicates: true` + `ignoreOrder: false` — dedupes each array while preserving first-occurrence order, then compares position-by-position
   */
  ignoreDuplicates?: boolean;
}

/**
 * Compare whether two arrays of primitive elements are equal
 * @param arr1 First array
 * @param arr2 Second array
 * @param options Comparison options
 */
export function isArrayEqual(arr1: any[], arr2: any[], options?: CompareOptions): boolean {
  const { ignoreOrder = false, ignoreDuplicates = false } = options ?? {};

  if (arr1 === arr2) {
    return true;
  }

  if (ignoreDuplicates) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    if (set1.size !== set2.size) {
      return false;
    }
    if (ignoreOrder) {
      for (const item of set1) {
        if (!set2.has(item)) {
          return false;
        }
      }
      return true;
    } else {
      const unique1 = Array.from(set1);
      const unique2 = Array.from(set2);
      return unique1.every((value, index) => isSameValueZero(value, unique2[index]));
    }
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  if (ignoreOrder) {
    const counts = new Map();
    for (const item of arr1) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }

    for (const item of arr2) {
      const count = counts.get(item);
      if (count === undefined || count === 0) {
        return false;
      }

      counts.set(item, count - 1);
    }

    return true;
  }

  return arr1.every((value, index) => isSameValueZero(value, arr2[index]));
}
