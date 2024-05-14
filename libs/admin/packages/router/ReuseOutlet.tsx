import type { MatchRoutes } from './reuse-route';
import type { Route } from './types';
import type { Location, RouteMatch } from 'react-router-dom';

import { isNull, isUndefined } from 'lodash';
import { Fragment, memo, useContext, useEffect, useRef } from 'react';
import { UNSAFE_RouteContext, useLocation } from 'react-router-dom';

import { RouterContext } from './context';
import { ReuseRoute } from './reuse-route';
import { querySelector } from './utils';

interface KeepProps {
  children: React.ReactElement | null;
  keep: boolean;
}
const Keep = memo(
  (props: KeepProps) => props.children,
  (prev, next) => next.keep,
);

interface WrapperProps {
  children: React.ReactElement | null;
  cache: boolean;
  retrieveScroll: React.MutableRefObject<{ retrieveScroll?: () => void }>;
}
function Wrapper(props: WrapperProps) {
  const { children, cache, retrieveScroll } = props;

  useEffect(() => {
    if (!cache) {
      retrieveScroll.current.retrieveScroll?.();
    }
  }, [cache]);

  return (
    <section style={cache ? { display: 'none' } : undefined} aria-hidden={cache}>
      <Keep keep={cache}>{children}</Keep>
    </section>
  );
}

export interface ReuseOutletOptions {
  scrollSelector?: string;
  routeKey?: false | ((location: Location, matches: RouteMatch<string, Route>[] | null) => string);
}
export function createReuseOutlet(reuse: Map<string, (string | RegExp)[]>, options: ReuseOutletOptions) {
  const reuseRoute = new ReuseRoute(reuse);

  const { scrollSelector, routeKey } = options;

  return memo(() => {
    const location = useLocation();

    const cache = useRef<{
      path: string;
      matches: MatchRoutes;
      outlet: React.ReactElement | null;
      data: any;
      retrieveScroll?: () => void;
    }>({
      path: '/',
      matches: null,
      outlet: null,
      data: { top: 0, left: 0 },
    });

    if (location.pathname !== cache.current.path) {
      cache.current.path = location.pathname;
      const el = querySelector(scrollSelector);
      if (el) {
        cache.current.data = { top: el.scrollTop, left: el.scrollLeft };
      }
    }

    let outlet = useContext(UNSAFE_RouteContext).outlet;
    const { matches } = useContext(RouterContext);
    if (reuseRoute.shouldReuseRoute(cache.current.matches, matches)) {
      if (reuseRoute.shouldDetach(cache.current.matches)) {
        reuseRoute.store(cache.current.matches, cache.current.outlet, cache.current.data);
      }
      if (reuseRoute.shouldAttach(matches)) {
        const saved = reuseRoute.retrieve(matches);
        if (!isNull(saved)) {
          outlet = saved[0] as React.ReactElement;
          cache.current.retrieveScroll = () => {
            cache.current.retrieveScroll = undefined;
            const el = querySelector(scrollSelector);
            if (el) {
              el.scrollTop = saved[1].top;
              el.scrollLeft = saved[1].left;
            }
          };
        }
      }
    }
    cache.current.matches = matches;
    cache.current.outlet = outlet;

    return (
      <>
        {[[ReuseRoute.getPath(matches), [outlet, {}]] as [string, [React.ReactElement | null, any]]]
          .concat(Array.from(reuseRoute.routes.entries()))
          .map(([path, [node]], index) => (
            <Wrapper key={path} cache={index > 0} retrieveScroll={cache}>
              <Fragment key={isUndefined(routeKey) ? location.pathname : routeKey === false ? undefined : routeKey(location, matches)}>
                {node}
              </Fragment>
            </Wrapper>
          ))}
      </>
    );
  });
}
