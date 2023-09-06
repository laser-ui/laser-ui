import { Outlet } from 'react-router-dom';

import styles from './IframeLayout.module.scss';

export function IframeLayout(): JSX.Element | null {
  return (
    <main id="app-main" className={styles['app-layout']}>
      <section id="app-content">
        <Outlet />
      </section>
    </main>
  );
}

export default IframeLayout;
