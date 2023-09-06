import type { TableContextData } from './types';

import { createContext } from 'react';

export const CLASSES = {
  table: '^table',
  'table--border': '^table--border',
  table__cell: '^table__cell',
  'table__cell--left': '^table__cell--left',
  'table__cell--right': '^table__cell--right',
  'table__cell--center': '^table__cell--center',
  'table__cell--fixed-left': '^table__cell--fixed-left',
  'table__cell--fixed-right': '^table__cell--fixed-right',
  'table__cell--ellipsis': '^table__cell--ellipsis',
  'table__cell--th-sort': '^table__cell--th-sort',
  'table__cell-content': '^table__cell-content',
  'table__cell-text': '^table__cell-text',
  'table__th-actions': '^table__th-actions',
  'table__th-action': '^table__th-action',
  'table__th-action.is-active': 'is-active',
  'table__th-action.is-disabled': 'is-disabled',
  'table__th-action--sort': '^table__th-action--sort',
  'table__th-sort-icon': '^table__th-sort-icon',
  'table__th-sort-icon.is-active': 'is-active',
  table__filter: '^table__filter',
  table__empty: '^table__empty',
  'table__empty-content': '^table__empty-content',
  table__expand: '^table__expand',
  'table__expand.is-expand': 'is-expand',
};

export const TableContext = createContext<TableContextData>(undefined as any);
