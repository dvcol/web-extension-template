<script lang="ts" module>
  export type AppProps = {
    baseUrl?: string;
    view?: { option?: boolean; popup?: boolean; web?: boolean };
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  import LazyComponent from '~/components/utils/LazyComponent.svelte';
  import Suspense from '~/components/utils/Suspense.svelte';
  import { waitI18nReady } from '~/utils/i18n.utils';

  const { baseUrl, view }: AppProps = $props();

  const HomeComponent = import('~/components/home/HomeComponent.svelte');

  onMount(() => {
    console.info('baseUrl:', baseUrl);
    console.info('view:', view);
  });
</script>

<div class="app-container">
  <Suspense promise={waitI18nReady()}>
    <LazyComponent component={HomeComponent} />
  </Suspense>
</div>

<style lang="scss">
  @use 'src/styles/base.scss';

  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
