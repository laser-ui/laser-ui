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

  let key = -1;

  return memo(() => {
    const location = useLocation();

    const cache = useRef<{
      prevMatches: MatchRoutes;
      prevMatchPath: string | null;
      prevOutlet: React.ReactElement | null;
      prevData: any;
      key: number;
      retrieveScroll?: () => void;
    }>({
      prevMatches: null,
      prevMatchPath: null,
      prevOutlet: null,
      prevData: { top: 0, left: 0, key },
      key,
    });

    let { outlet } = useContext(UNSAFE_RouteContext);
    const { matches } = useContext(RouterContext);
    const matchPath = ReuseRoute.getPath(matches);

    if (reuseRoute.shouldReuseRoute(cache.current.prevMatches, matches)) {
      const el = querySelector(scrollSelector);
      cache.current.prevData = Object.assign({ key: cache.current.key }, el ? { top: el.scrollTop, left: el.scrollLeft } : {});

      key += 1;
      cache.current.key = key;

      if (reuseRoute.shouldDetach(cache.current.prevMatches)) {
        reuseRoute.store(cache.current.prevMatches, cache.current.prevOutlet, cache.current.prevData);
      }
      if (reuseRoute.shouldAttach(matches)) {
        const saved = reuseRoute.retrieve(matches);
        if (!isNull(saved)) {
          outlet = saved[0];
          cache.current.prevData = saved[1];
          cache.current.key = saved[1].key;
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

    cache.current.prevMatches = matches;
    cache.current.prevMatchPath = matchPath;
    cache.current.prevOutlet = outlet;

    const k = isUndefined(routeKey) ? location.pathname : routeKey === false ? undefined : routeKey(location, matches);

    return (
      <>
        {[[outlet, { key: cache.current.key }] as const].concat(Array.from(reuseRoute.routes.values())).map(([node, { key }], index) => (
          <Wrapper key={key} cache={index > 0} retrieveScroll={cache}>
            <Fragment key={k}>{node}</Fragment>
          </Wrapper>
        ))}
      </>
    );
  });
}
