import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './header/Header';
import { Sidebar } from './sidebar/Sidebar';

import styles from './Layout.module.scss';

export function Layout(): React.ReactElement | null {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const route = location.pathname.startsWith('/docs') ? 'docs' : location.pathname.startsWith('/components') ? 'components' : 'home';

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <Sidebar route={route} menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <main id="app-main" className={styles['app-layout']} style={{ width: route === 'home' ? '100%' : undefined }}>
        <section id="app-content">
          <Outlet />
        </section>
      </main>
    </>
  );
}

export default Layout;
