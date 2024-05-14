import type { Route } from './types';
import type { RouteMatch } from 'react-router-dom';

import { createContext } from 'react';

export interface RouterContextData {
  outlet: React.ReactElement | null;
  matches: RouteMatch<string, Route>[] | null;
  title?: string;
}
export const RouterContext = createContext<RouterContextData>({
  outlet: null,
  matches: null,
});
