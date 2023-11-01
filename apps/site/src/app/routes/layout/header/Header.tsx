import type { HeaderProps } from './types';
import type { Theme } from '../../../../types';
import type { DropdownItem } from '@laser-ui/components/dropdown/types';
import type { Lang } from '@laser-ui/components/types';

import { Dropdown, Icon, Menu, Separator } from '@laser-ui/components';
import { useStorage } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import { ReactComponent as TranslateOutlined } from '@material-design-icons/svg/outlined/translate.svg';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { STORAGE_KEY } from '../../../configs/storage';

import styles from './Header.module.scss';

export function Header(props: HeaderProps): JSX.Element | null {
  const { menuOpen, onMenuOpenChange } = props;

  const { i18n, t } = useTranslation();
  const languageStorage = useStorage<Lang>(...STORAGE_KEY.language);
  const themeStorage = useStorage<Theme>(...STORAGE_KEY.theme);

  const location = useLocation();
  const active = location.pathname.startsWith('/docs') ? 'docs' : location.pathname.startsWith('/components') ? 'components' : null;

  return (
    <header className={styles['app-header']}>
      <Link className={styles['app-header__logo-container']} to="/">
        <img src="/logo.png" alt="Logo" width="36" height="36" />
        <span className={styles['app-header__logo-title']}>Laser UI</span>
      </Link>
      <button
        className={classNames(styles['app-header__button'], styles['app-header__button--menu'])}
        aria-label={t(menuOpen ? 'Close main navigation' : 'Open main navigation')}
        onClick={() => onMenuOpenChange(true)}
      >
        <div
          className={classNames(styles['app-header__hamburger'], {
            'is-active': menuOpen,
          })}
        >
          <div />
          <div />
          <div />
        </div>
      </button>
      {/* {import.meta.env.PROD && <AppVersions />} */}
      <Menu
        className={styles['app-header__menu']}
        styleOverrides={{ 'menu__item--horizontal': { className: styles['app-header__menu-item'] } }}
        list={[
          {
            id: 'docs',
            title: (
              <Link tabIndex={-1} to="/docs">
                {t('Docs')}
              </Link>
            ),
            type: 'item',
          },
          {
            id: 'components',
            title: (
              <Link tabIndex={-1} to="/components">
                {t('Components')}
              </Link>
            ),
            type: 'item',
          },
        ]}
        mode="horizontal"
        active={active}
      />
      <Separator className={styles['app-header__separator']} vertical />
      <div className={styles['app-header__button-container']}>
        <Dropdown
          list={(
            [
              ['🇨🇳', '简体中文', 'zh-CN'],
              ['🇺🇸', 'English', 'en-US'],
            ] as [string, string, Lang][]
          ).map<DropdownItem<Lang>>((item) => ({
            id: item[2],
            title: (
              <div className={languageStorage.value === item[2] ? 'app-theme-primary' : undefined}>
                <span className={styles['app-header__language-region']}>{item[0]}</span>
                <span>{item[1]}</span>
              </div>
            ),
            type: 'item',
          }))}
          onClick={(id: Lang) => {
            languageStorage.set(id);
            i18n.changeLanguage(id);
          }}
        >
          <button className={styles['app-header__button']} aria-label={t('Change language')}>
            <Icon size={24}>
              <TranslateOutlined />
            </Icon>
          </button>
        </Dropdown>
        <button
          className={styles['app-header__button']}
          aria-label={t(themeStorage.value === 'light' ? 'Dark theme' : 'Light theme')}
          onClick={() => {
            themeStorage.set(themeStorage.value === 'light' ? 'dark' : 'light');
          }}
        >
          <Icon size={24}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {themeStorage.value === 'light' ? (
                <path d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17 15C17.476 15 17.9408 14.9525 18.3901 14.862C17.296 17.3011 14.8464 19 12 19C8.13401 19 5 15.866 5 12C5 8.60996 7.40983 5.78277 10.6099 5.13803C10.218 6.01173 10 6.98041 10 8C10 11.866 13.134 15 17 15Z" />
              ) : (
                <>
                  <path d="M10.5 1.5C10.5 0.671573 11.1716 0 12 0C12.8284 0 13.5 0.671573 13.5 1.5V2.5C13.5 3.32843 12.8284 4 12 4C11.1716 4 10.5 3.32843 10.5 2.5V1.5Z" />
                  <path d="M10.5 21.5C10.5 20.6716 11.1716 20 12 20C12.8284 20 13.5 20.6716 13.5 21.5V22.5C13.5 23.3284 12.8284 24 12 24C11.1716 24 10.5 23.3284 10.5 22.5V21.5Z" />
                  <path d="M24 12C24 11.1716 23.3284 10.5 22.5 10.5H21.5C20.6716 10.5 20 11.1716 20 12C20 12.8284 20.6716 13.5 21.5 13.5H22.5C23.3284 13.5 24 12.8284 24 12Z" />
                  <path d="M2.5 10.5C3.32843 10.5 4 11.1716 4 12C4 12.8284 3.32843 13.5 2.5 13.5H1.5C0.671573 13.5 0 12.8284 0 12C0 11.1716 0.671573 10.5 1.5 10.5H2.5Z" />
                  <path d="M20.4853 3.51472C19.8995 2.92893 18.9497 2.92893 18.364 3.51472L17.6569 4.22182C17.0711 4.80761 17.0711 5.75736 17.6569 6.34314C18.2426 6.92893 19.1924 6.92893 19.7782 6.34314L20.4853 5.63604C21.0711 5.05025 21.0711 4.1005 20.4853 3.51472Z" />
                  <path d="M4.22181 17.6569C4.8076 17.0711 5.75734 17.0711 6.34313 17.6569C6.92892 18.2426 6.92892 19.1924 6.34313 19.7782L5.63602 20.4853C5.05024 21.0711 4.10049 21.0711 3.5147 20.4853C2.92892 19.8995 2.92892 18.9497 3.5147 18.364L4.22181 17.6569Z" />
                  <path d="M3.5147 3.51472C2.92891 4.1005 2.92891 5.05025 3.5147 5.63604L4.22181 6.34315C4.80759 6.92893 5.75734 6.92893 6.34313 6.34315C6.92891 5.75736 6.92891 4.80761 6.34313 4.22183L5.63602 3.51472C5.05023 2.92893 4.10049 2.92893 3.5147 3.51472Z" />
                  <path d="M17.6569 19.7782C17.0711 19.1924 17.0711 18.2426 17.6569 17.6569C18.2426 17.0711 19.1924 17.0711 19.7782 17.6569L20.4853 18.364C21.0711 18.9497 21.0711 19.8995 20.4853 20.4853C19.8995 21.0711 18.9497 21.0711 18.364 20.4853L17.6569 19.7782Z" />
                  <path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" />
                </>
              )}
            </svg>
          </Icon>
        </button>
        <a
          className={styles['app-header__button']}
          href="//github.com/laser-ui/laser-ui"
          target="_blank"
          rel="noreferrer"
          aria-label={t('GitHub repository')}
        >
          <Icon size={24}>
            <svg viewBox="64 64 896 896" xmlns="http://www.w3.org/2000/svg">
              <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
            </svg>
          </Icon>
        </a>
      </div>
    </header>
  );
}
