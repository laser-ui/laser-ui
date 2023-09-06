import type resources from '../resources.json';
import type { Lang } from '../types';

export {};

type PartialContext<T extends object> = { [K in keyof T]?: T[K] extends object ? PartialContext<T[K]> : T[K] };

export interface RootProps {
  context?: {
    i18n?: {
      lang?: Lang;
      resources?: PartialContext<typeof resources>;
    };
  };
  children?: React.ReactNode;
}
