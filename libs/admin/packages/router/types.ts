import type { Control, ControlMode } from '../acl/acl';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

export {};

export interface TitleOptions {
  default?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
}

export interface RouteData {
  title?: string;
  acl?:
    | {
        control: Control | Control[];
        mode?: ControlMode;
      }
    | Control
    | Control[];
  canActivate?: CanActivateFn[];
  canActivateChild?: CanActivateFn[];
  cache?: string;
}

export interface IndexRoute extends IndexRouteObject {
  data?: RouteData;
}
export interface NonIndexRoute extends Omit<NonIndexRouteObject, 'children'> {
  children?: Route[];
  data?: RouteData;
}
export type Route = IndexRoute | NonIndexRoute;

export interface IndexRouteItem extends IndexRouteObject {
  data?: RouteData | ((params: any) => RouteData);
}
export interface NonIndexRouteItem extends Omit<NonIndexRouteObject, 'children'> {
  children?: RouteItem[];
  data?: RouteData | ((params: any) => RouteData);
}
export type RouteItem = IndexRouteItem | NonIndexRouteItem;

export type CanActivateFn = (route: Route) => true | React.ReactElement;
