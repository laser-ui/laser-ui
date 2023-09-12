import { Button, Icon } from '@laser-ui/components';
import { ReactComponent as KeyboardArrowRightOutlined } from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './Home.module.scss';

export function HomeRoute(): JSX.Element | null {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Laser UI';
  }, []);

  return (
    <main className={styles['app-home-route']}>
      <section className={styles['app-home-route__container']}>
        <img className={styles['app-home-route__logo']} src="/logo.png" alt="Logo" width="128" height="128" />
        <section className={styles['app-home-route__main']}>
          <h1 className={styles['app-home-route__title']}>Laser UI</h1>
          <p className={styles['app-home-route__description']}>{t('home.Title')}</p>
          <Link className={styles['app-home-route__link']} to="/components">
            <Button
              icon={
                <Icon>
                  <KeyboardArrowRightOutlined />
                </Icon>
              }
              iconRight
            >
              {t('home.Getting Started')}
            </Button>
          </Link>
        </section>
      </section>
      <div className={styles['app-home-route__footer']}>
        <section>
          © {new Date().getFullYear()} made with ❤ by{' '}
          <a className={styles['app-home-route__footer-link']} href="//github.com/xiejay97">
            Xie Jay
          </a>
        </section>
      </div>
    </main>
  );
}

export default HomeRoute;
