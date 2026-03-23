import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { PageLoading } from '~/components/common/loading/PageLoading';

import styles from './AppComponent.module.scss';

export function AppComponent() {
  return (
    <>
      <header className={styles.header}>
        <nav />
      </header>
      <main className={styles.main}>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className={styles.footer} />
    </>
  );
}
