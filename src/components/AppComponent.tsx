import { Outlet } from 'react-router';

import styles from './AppComponent.module.scss';

export function AppComponent() {
  return (
    <>
      <header className={styles.header}>
        <nav />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer} />
    </>
  );
}
