import { isFunction } from 'lodash';

export function setRef(ref: React.Ref<any> | undefined, instance: any): () => void {
  if (isFunction(ref)) {
    ref(instance);
    return () => {
      ref(null);
    };
  } else if (ref) {
    ref.current = instance;
    return () => {
      ref.current = null;
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}
