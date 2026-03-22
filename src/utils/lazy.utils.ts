import { lazy } from 'react';

export function lazyComponent<T extends React.ComponentType<any>>(loader: () => Promise<{ default: T }>): React.LazyExoticComponent<T> {
  return lazy(loader);
}

export default lazyComponent;
