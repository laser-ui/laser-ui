import type { MatchRoutes } from './reuse-route';

import { isNull, isUndefined } from 'lodash';
import { Fragment, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { ReuseRoute } from './reuse-route';

const Keep = memo(
  (props: { children: React.ReactElement; keep: boolean }) => {
    return props.children;
  },
  (prev, next) => next.keep,
);

export interface RouterProps {
  children: React.ReactNode;
  matches: MatchRoutes;
  reuse?: ReuseRoute;
  routeKey?: ((matches: MatchRoutes) => React.Key) | false;
}

export function Router(props: RouterProps) {
  const { children, matches, reuse, routeKey } = props;

  const location = useLocation();

  const cache = useRef<[MatchRoutes, React.ReactNode]>([null, null]);

  let page = children;
  if (reuse) {
    if (reuse.shouldReuseRoute(cache.current[0], matches)) {
      if (reuse.shouldDetach(cache.current[0])) {
        reuse.store(...cache.current);
      }
      if (reuse.shouldAttach(matches)) {
        const saved = reuse.retrieve(matches);
        if (!isNull(saved)) {
          page = saved;
        }
      }
    }
  }

  cache.current = [matches, page];

  return (
    <>
      {[[ReuseRoute.getPath(matches), page] as [string, React.ReactNode]]
        .concat(reuse ? Array.from(reuse.pages.entries()) : [])
        .map(([path, node], index) => (
          <section key={path} style={index > 0 ? { visibility: 'hidden' } : undefined} aria-hidden={index > 0}>
            <Keep keep={index > 0}>
              <Fragment key={isUndefined(routeKey) ? location.pathname : routeKey === false ? undefined : routeKey(matches)}>
                {node as any}
              </Fragment>
            </Keep>
          </section>
        ))}
    </>
  );
}
