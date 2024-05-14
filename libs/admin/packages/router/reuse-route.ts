/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { matchRoutes } from 'react-router-dom';

import { isString } from 'lodash';

export type MatchRoutes = ReturnType<typeof matchRoutes>;

export class ReuseRoute {
  static getPath(routes: MatchRoutes): string | null {
    if (routes) {
      return routes.reduce((previous, current) => previous + '/' + (current.route.path ?? '/'), '/').replace(/\/+/g, '/');
    }
    return routes;
  }

  public routes = new Map<string, [React.ReactElement | null, any]>();

  private _currPath: string | null = null;
  private _futurePath: string | null = null;
  private _reuse: Map<string, (string | RegExp)[]>;

  constructor(reuse: Map<string, (string | RegExp)[]>) {
    this._reuse = reuse;
  }

  shouldDetach(routes: MatchRoutes): boolean {
    if (this._currPath && this._futurePath && this._reuse.has(this._currPath)) {
      const matches = this._reuse.get(this._currPath)!;
      const shouldDetach = matches.some((match) => (isString(match) ? match === this._futurePath : match.test(this._futurePath!)));
      if (!shouldDetach) {
        this.routes.delete(this._currPath);
      }
      return shouldDetach;
    }
    return false;
  }

  store(routes: MatchRoutes, node: React.ReactElement | null, data: any): void {
    if (this._currPath) {
      this.routes.set(this._currPath, [node, data]);
    }
  }

  shouldAttach(routes: MatchRoutes): boolean {
    if (this._currPath && this._futurePath && this._reuse.has(this._futurePath)) {
      const matches = this._reuse.get(this._futurePath)!;
      const shouldAttach = matches.some((match) => (isString(match) ? match === this._currPath : match.test(this._currPath!)));
      if (!shouldAttach) {
        this.routes.delete(this._futurePath);
      }
      return shouldAttach;
    }
    return false;
  }

  retrieve(routes: MatchRoutes): [React.ReactElement | null, any] | null {
    if (this._futurePath) {
      const page = this.routes.get(this._futurePath);
      if (page) {
        this.routes.delete(this._futurePath);
        return page;
      }
    }
    return null;
  }

  shouldReuseRoute(curr: MatchRoutes, future: MatchRoutes): boolean {
    this._currPath = ReuseRoute.getPath(curr);
    this._futurePath = ReuseRoute.getPath(future);

    if (this._currPath && this._futurePath) {
      return this._currPath !== this._futurePath;
    }
    return false;
  }
}
