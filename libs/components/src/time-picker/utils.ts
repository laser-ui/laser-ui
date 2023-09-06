import type { OpUnitType } from 'dayjs';

import { isArray, isDate, isNull } from 'lodash';

import dayjs from '../dayjs';

export function deepCompareDate(a: Date | [Date, Date] | null, b: Date | [Date, Date] | null, format: string) {
  const isSame = (t1: Date, t2: Date) => dayjs(t1).format(format) === dayjs(t2).format(format);

  if (isDate(a) && isDate(b)) {
    return isSame(a, b);
  }
  if (isNull(a) && isNull(b)) {
    return true;
  }
  if (isArray(a) && isArray(b)) {
    return isSame(a[0], b[0]) && isSame(a[1], b[1]);
  }
  return false;
}

export function orderDate(date: [Date, Date], order: 'ascend' | 'descend' | false, unit?: OpUnitType): boolean {
  if ((order === 'ascend' && dayjs(date[0]).isAfter(date[1], unit)) || (order === 'descend' && dayjs(date[0]).isBefore(date[1], unit))) {
    return true;
  }
  return false;
}

export function orderTime(time: [Date, Date], order: 'ascend' | 'descend' | false): boolean {
  const t1 = dayjs(time[0]).set('year', 2000).set('month', 0).set('date', 1);
  const t2 = dayjs(time[1]).set('year', 2000).set('month', 0).set('date', 1);

  return orderDate([t1.toDate(), t2.toDate()], order);
}
