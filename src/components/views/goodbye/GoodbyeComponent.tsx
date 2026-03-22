import { Link } from 'react-router-dom';

import { Route } from '~/router';
import { useI18n } from '~/utils/i18n.utils';

import styles from './GoodbyeComponent.module.scss';

export function GoodbyeComponent() {
  const i18n = useI18n('goodbye');

  return (
    <div className={styles.text}>
      <span className={styles.title}>{i18n('app_name', 'global')}</span>
      <Link to={Route.Hello}>{i18n('title')}</Link>
    </div>
  );
}
