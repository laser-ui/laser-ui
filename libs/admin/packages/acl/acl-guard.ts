import type { CanActivateFn } from '../router/types';

import { isObject } from 'lodash';
import { createElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useACL } from './useACL';

export function useACLGuard(redirect: string, state?: any): CanActivateFn {
  const acl = useACL();
  return (route) => {
    if (route.data && route.data.acl) {
      const params = isObject(route.data.acl) && 'control' in route.data.acl ? route.data.acl : { control: route.data.acl };
      if (!acl.can(params.control, params.mode)) {
        return createElement(Navigate, {
          to: redirect,
          state,
          replace: true,
        });
      }
    }

    return true;
  };
}
