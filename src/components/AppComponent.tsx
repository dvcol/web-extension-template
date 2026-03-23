import { AnimatedOutlet } from '~/components/common/motion/AnimatedOutlet';

import styles from './AppComponent.module.scss';

export function AppComponent() {
  return (
    <>
      <header className={styles.header}>
        <nav />
      </header>
      <main className={styles.main}>
        <AnimatedOutlet />
      </main>
      <footer className={styles.footer} />
    </>
  );
}
