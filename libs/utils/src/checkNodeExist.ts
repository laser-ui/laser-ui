import { isArray, isNumber } from 'lodash';

export function checkNodeExist(node: any) {
  if (isNumber(node)) {
    return true;
  }
  if (isArray(node)) {
    return node.length > 0;
  }
  return !!node;
}
