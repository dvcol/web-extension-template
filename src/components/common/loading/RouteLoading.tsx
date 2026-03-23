import { lazy, Suspense, useEffect, useState } from 'react';

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

export function RouterHydrate({ delay = 500 }: { delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(setShow, delay, true);
    return () => clearTimeout(id);
  }, [delay]);

  if (!show) return;

  return (
    <Suspense fallback={<div style={fallbackStyle}>Loading…</div>}>
      <PageLoading />
    </Suspense>
  );
}
