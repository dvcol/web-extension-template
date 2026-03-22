import { Link } from 'react-router-dom';

import { Route } from '~/router';
import { useI18n } from '~/utils/i18n.utils';

import styles from './HelloComponent.module.scss';

export function HelloComponent() {
  const i18n = useI18n('hello');

  return (
    <div className={styles.text}>
      <span className={styles.title}>{i18n('app_name', 'global')}</span>
      <Link to={Route.Goodbye}>{i18n('title')}</Link>
    </div>
  );
}
