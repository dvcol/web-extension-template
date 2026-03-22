import { IconLoadingMatrix } from '~/components/icons/IconLoadingMatrix';

import styles from './PageLoading.module.scss';

export function PageLoading() {
  return (
    <div className={styles.loadingContainer}>
      <IconLoadingMatrix className={styles.loader} />
    </div>
  );
}
