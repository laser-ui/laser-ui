import type { AnchorItem, AnchorProps } from './types';

import { useEvent, useEventCallback, useIsomorphicLayoutEffect, useRefExtra, useResize } from '@laser-ui/hooks';
import { getOffsetToRoot, scrollTo, toPx } from '@laser-ui/utils';
import { isArray, isString, isUndefined } from 'lodash';
import { Fragment, useImperativeHandle, useRef, useState } from 'react';

import { CLASSES, DOT_INDICATOR, LINE_INDICATOR } from './vars';
import { useComponentProps, useLayout, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Anchor: {
  <T extends AnchorItem>(props: AnchorProps<T>): React.ReactElement | null;
  DOT_INDICATOR: typeof DOT_INDICATOR;
  LINE_INDICATOR: typeof LINE_INDICATOR;
} = <T extends AnchorItem>(props: AnchorProps<T>) => {
  const {
    ref,
    styleOverrides,
    styleProvider,
    list,
    page,
    distance: distanceProp = 0,
    scrollBehavior = 'instant',
    indicator = DOT_INDICATOR,
    onClick,

    ...restProps
  } = useComponentProps('Anchor', props);

  const styled = useStyled(CLASSES, { anchor: styleProvider?.anchor }, styleOverrides);
  const { pageScrollRef, contentResizeRef } = useLayout();

  const pageRef = useRefExtra(page ?? (() => pageScrollRef.current));
  const anchorRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clearTid = useRef(() => {});

  const [active, setActive] = useState<string | null>(null);

  const updateAnchor = useEventCallback(() => {
    if (pageRef.current && anchorRef.current && indicatorRef.current) {
      const pageTop = getOffsetToRoot(pageRef.current);
      let nearestEl: [string, number] | undefined;
      const reduceLinks = (arr: T[]) => {
        arr.forEach(({ href, children }) => {
          const el = document.getElementById(href);
          if (el && pageRef.current) {
            const top = getOffsetToRoot(el);
            const distance = isString(distanceProp) ? toPx(distanceProp, true) : distanceProp;
            if (Math.ceil(pageRef.current.scrollTop) + distance >= top - pageTop) {
              if (isUndefined(nearestEl)) {
                nearestEl = [href, top];
              } else if (top > nearestEl[1]) {
                nearestEl = [href, top];
              }
            }
          }
          if (isArray(children)) {
            reduceLinks(children as T[]);
          }
        });
      };
      reduceLinks(list);

      const href = nearestEl ? nearestEl[0] : null;
      setActive(href);
      if (href) {
        const rect = (anchorRef.current.querySelector(`[data-l-href="${href}"]`) as HTMLLIElement).getBoundingClientRect();
        const top = rect.top - anchorRef.current.getBoundingClientRect().top + rect.height / 2;
        indicatorRef.current.style.cssText = `opacity:1;top:${top}px;`;
      } else {
        indicatorRef.current.style.cssText += 'opacity:0;';
      }
    }
  });
  useIsomorphicLayoutEffect(() => {
    updateAnchor();
  }, []);

  useEvent(pageRef, 'scroll', updateAnchor, { passive: true });

  useResize(contentResizeRef, updateAnchor);

  useImperativeHandle(
    ref,
    () => ({
      active,
      updateAnchor,
    }),
    [active, updateAnchor],
  );

  const handleLinkClick = (href: string) => {
    if (pageRef.current) {
      const pageTop = getOffsetToRoot(pageRef.current);

      const scrollTop = pageRef.current.scrollTop;
      window.location.hash = `#${href}`;
      pageRef.current.scrollTop = scrollTop;

      const el = document.getElementById(href);
      if (el) {
        const top = getOffsetToRoot(el);
        const distance = isString(distanceProp) ? toPx(distanceProp, true) : distanceProp;
        clearTid.current();
        clearTid.current = scrollTo(pageRef.current, {
          top: top - pageTop - distance,
          behavior: scrollBehavior,
        });
      }
    }
  };

  return (
    <ul
      {...restProps}
      {...mergeCS(styled('anchor'), {
        className: restProps.className,
        style: restProps.style,
      })}
      ref={(instance) => {
        anchorRef.current = instance;
        return () => {
          anchorRef.current = null;
        };
      }}
    >
      <div {...styled('anchor__indicator-track')}>
        <div
          {...styled('anchor__indicator-wrapper')}
          ref={(instance) => {
            indicatorRef.current = instance;
            return () => {
              indicatorRef.current = null;
            };
          }}
        >
          {indicator === DOT_INDICATOR ? (
            <div {...styled('anchor__dot-indicator')} />
          ) : indicator === LINE_INDICATOR ? (
            <div {...styled('anchor__line-indicator')} />
          ) : (
            indicator
          )}
        </div>
      </div>
      {(() => {
        const getNodes = (arr: T[], level = 0): React.ReactElement[] =>
          arr.map((link) => {
            const { title: linkTitle, href: linkHref, target: linkTarget, children } = link;
            return (
              <Fragment key={`${linkHref}-${level}`}>
                <li
                  {...styled('anchor__link', {
                    'anchor__link.is-active': linkHref === active,
                  })}
                  data-l-href={linkHref}
                >
                  <a
                    style={{ paddingLeft: 16 + level * 16 }}
                    href={`#${linkHref}`}
                    target={linkTarget}
                    onClick={(e) => {
                      e.preventDefault();

                      handleLinkClick(linkHref);
                      onClick?.(linkHref, link);
                    }}
                  >
                    {linkTitle ?? linkHref}
                  </a>
                </li>
                {children && getNodes(children as T[], level + 1)}
              </Fragment>
            );
          });

        return getNodes(list);
      })()}
    </ul>
  );
};

Anchor.DOT_INDICATOR = DOT_INDICATOR;
Anchor.LINE_INDICATOR = LINE_INDICATOR;
