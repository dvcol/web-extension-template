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
  import { Logger } from '~/services/logger.service';
  import { initServices } from '~/web/init-services';

  const { baseUrl, view }: AppProps = $props();

  const HomeComponent = import('~/components/home/HomeComponent.svelte');

  onMount(() => {
    Logger.info('baseUrl:', baseUrl);
  });
</script>

<div class="app-container">
  <Suspense promise={initServices(view)}>
    <LazyComponent component={HomeComponent} />
  </Suspense>
</div>

<style lang="scss" global>
  @use 'src/styles/base.scss';

  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: var(--full-height);
  }
</style>
