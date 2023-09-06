import type { SidebarProps } from './types';
import type { MenuItem } from '@laser-ui/components/menu/types';
import type { Lang } from '@laser-ui/components/types';

import { Drawer, Icon, Menu } from '@laser-ui/components';
import { useStorage } from '@laser-ui/hooks';
import { ReactComponent as BookOutlined } from '@material-design-icons/svg/outlined/book.svg';
import { ReactComponent as DashboardOutlined } from '@material-design-icons/svg/outlined/dashboard.svg';
import { ReactComponent as NavigateNextOutlined } from '@material-design-icons/svg/outlined/navigate_next.svg';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import menu from '../../../../dist/menu.json';
import { STORAGE_KEY } from '../../../configs/storage';

import styles from './Sidebar.module.scss';

export function Sidebar(props: SidebarProps): JSX.Element | null {
  const { route, menuOpen, onMenuOpenChange } = props;

  const { t } = useTranslation();
  const languageStorage = useStorage<Lang>(...STORAGE_KEY.language);

  const location = useLocation();
  const active = location.pathname.match(new RegExp(String.raw`^\/${route}\/(.+$)`))?.[1] ?? null;

  const menuNode = (
    <Menu
      className={styles['app-sidebar__menu']}
      list={
        route === 'docs'
          ? ([
              {
                id: 'Overview',
                title: (
                  <Link tabIndex={-1} to="/docs/Overview">
                    {t('docs-menu.Overview')}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'GettingStarted',
                title: (
                  <Link tabIndex={-1} to="/docs/GettingStarted">
                    {t('docs-menu.Getting Started')}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'DynamicTheme',
                title: (
                  <Link tabIndex={-1} to="/docs/DynamicTheme">
                    {t('docs-menu.Dynamic Theme')}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'Internationalization',
                title: (
                  <Link tabIndex={-1} to="/docs/Internationalization">
                    {t('docs-menu.Internationalization')}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'GlobalConfiguration',
                title: (
                  <Link tabIndex={-1} to="/docs/GlobalConfiguration">
                    {t('docs-menu.GlobalConfiguration')}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'FAQ',
                title: (
                  <Link tabIndex={-1} to="/docs/FAQ">
                    FAQ
                  </Link>
                ),
                type: 'item',
              },
            ] as MenuItem<string>[])
          : menu.map<MenuItem<string>>((group) => ({
              id: group.title,
              title: t(`menu.components-group.${group.title}` as any),
              type: 'group',
              children: (group.title === 'Other'
                ? group.children.concat([{ title: 'Interface', to: '/components/Interface' }])
                : group.children
              ).map<MenuItem<string>>((child) => ({
                id: child.title,
                title: (
                  <Link tabIndex={-1} to={child.to}>
                    {child.title}
                    {languageStorage.value !== 'en-US' && (
                      <span className={styles['app-sidebar__menu-subtitle']}>{t(`menu.components.${child.title}` as any)}</span>
                    )}
                  </Link>
                ),
                type: 'item',
              })),
            }))
      }
      active={active}
    ></Menu>
  );

  return (
    <>
      {route !== 'home' && <div className={styles['app-sidebar']}>{menuNode}</div>}
      <Drawer
        styleOverrides={{ drawer__body: { style: { padding: '12px 0 0 0' } } }}
        visible={menuOpen}
        header={
          <Drawer.Header styleOverrides={{ 'drawer__header-title': { style: { display: 'flex', alignItems: 'center' } } }}>
            <Link className={styles['app-sidebar__header-logo']} to="/">
              <img style={{ marginRight: 4 }} src="/logo.png" alt="Logo" width="24" height="24" />
              <span>Laser UI</span>
            </Link>
          </Drawer.Header>
        }
        width={280}
        onClose={() => {
          onMenuOpenChange(false);
        }}
      >
        <div className={styles['app-sidebar__button-container']}>
          <Link className={styles['app-sidebar__link-button']} to="/docs">
            <Icon>
              <BookOutlined />
            </Icon>
            {t('Docs')}
            <Icon>
              <NavigateNextOutlined />
            </Icon>
          </Link>
          <Link className={styles['app-sidebar__link-button']} to="/components">
            <Icon>
              <DashboardOutlined />
            </Icon>
            {t('Components')}
            <Icon>
              <NavigateNextOutlined />
            </Icon>
          </Link>
        </div>
        {menuNode}
      </Drawer>
    </>
  );
}
