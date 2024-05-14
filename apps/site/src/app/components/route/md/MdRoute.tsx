import type { AnchorItem } from '@laser-ui/components/anchor/types';
import type { Lang } from '@laser-ui/components/types';

import { useStorage } from '@laser-ui/admin';
import { Anchor, Drawer, Icon } from '@laser-ui/components';
import { useImmer } from '@laser-ui/hooks';
import { isString, isUndefined } from 'lodash';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import marked from '../marked';
import { decode } from '../utils';

export interface MdRouteProps {
  html?: number[];
  links?: { title: string; href: string }[];
  children?: React.ReactNode;
}

export function MdRoute(props: MdRouteProps): JSX.Element | null {
  const { html: htmlProp, links: linksProp, children } = props;

  const html = htmlProp ? marked(decode(htmlProp)) : undefined;

  const languageStorage = useStorage<Lang>('language');
  const { t } = useTranslation();

  const [_links, setLinks] = useImmer<{ title?: string; href: string }[]>([]);
  const links: AnchorItem[] = isUndefined(linksProp)
    ? _links
    : (() => {
        const links: AnchorItem[] = [];
        const subLinks = new Map<string, AnchorItem[]>();
        for (const { title, href } of linksProp) {
          if (/^[\s\S]+# /.test(title)) {
            const [group, subTitle] = title.split('# ');
            if (subLinks.has(group)) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              subLinks.get(group)!.push({ title: subTitle, href });
            } else {
              subLinks.set(group, [{ title: subTitle, href }]);
            }
          } else {
            links.push({ title, href });
          }
        }
        for (const subLink of subLinks) {
          links.push({ href: subLink[0], children: subLink[1] });
        }
        links.push({ href: 'API' });
        return links;
      })();

  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    if (isUndefined(linksProp)) {
      const arr: { href: string }[] = [];
      document.querySelectorAll('.app-md-route h2').forEach((el) => {
        arr.push({ href: el.id });
      });
      setLinks(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageStorage.value]);

  useEffect(() => {
    if (isString(html)) {
      const el = document.querySelector('h1:first-child');
      document.title = el?.id + ' - Laser UI';
    }
  }, [html]);

  const iconNode = (top: boolean) => (
    <div
      style={{
        transform: menuOpen ? `translateY(${top ? '' : '-'}12px)` : undefined,
        transition: 'transform 200ms ease',
      }}
    >
      <Icon rotate={top ? 180 : undefined} size={16}>
        <svg viewBox="0 0 926.23699 573.74994" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(904.92214,-879.1482)">
            <path
              d="
m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
-55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
-174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
-174.68583 0.6895,0 26.281,25.03215 56.8701,
55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
-231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
-104.0616 -231.873,-231.248 z
"
            />
          </g>
        </svg>
      </Icon>
    </div>
  );

  return (
    <>
      <article className="app-md-route">
        <section className="app-md-route__content" dangerouslySetInnerHTML={html ? { __html: html } : undefined}>
          {children}
        </section>
      </article>
      <>
        {links.length > 0 && (
          <Drawer
            className="app-md-route__drawer"
            visible={menuOpen}
            placement="bottom"
            height="calc(100% - 64px)"
            mask={false}
            zIndex={909}
            onClose={() => {
              setMenuOpen(false);
            }}
          >
            <Anchor list={links} indicator={Anchor.LINE_INDICATOR} onClick={() => setMenuOpen(false)} />
          </Drawer>
        )}
        <button
          className="app-md-route__anchor-toggler"
          aria-label={t(menuOpen ? 'Close anchor navigation' : 'Open anchor navigation')}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {iconNode(true)}
          {iconNode(false)}
        </button>
      </>
      {links.length > 0 && <Anchor className="app-md-route__anchor" list={links} />}
    </>
  );
}
