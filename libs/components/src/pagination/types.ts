import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface PaginationProps
  extends BaseProps<'pagination', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  total: number;
  active?: number;
  defaultActive?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeList?: number[];
  compose?: ('total' | 'pages' | 'page-size' | 'jump')[];
  customRender?: {
    total?: (range: [number, number]) => React.ReactNode;
    prev?: React.ReactNode;
    page?: (page: number) => React.ReactNode;
    next?: React.ReactNode;
    pageSize?: (pageSize: number) => React.ReactNode;
    jump?: (input: React.ReactNode) => React.ReactNode;
  };
  mini?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}
