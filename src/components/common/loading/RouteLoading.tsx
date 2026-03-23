import { lazy, Suspense } from 'react';

const PageLoading = lazy(async () =>
  import('~/components/common/loading/PageLoading').then(m => ({ default: m.PageLoading })),
);

const fallbackStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
};

export function RouterHydrate() {
  return (
    <Suspense fallback={<div style={fallbackStyle}>Loading…</div>}>
      <PageLoading />
    </Suspense>
  );
}
