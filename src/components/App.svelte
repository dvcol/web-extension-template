<script lang="ts">
  import type { AppProps } from '~/components/app.model';

  import { NeoLazy, NeoPortalContainer, NeoSuspense, NeoThemeProvider } from '@dvcol/neo-svelte';
  import { onMount } from 'svelte';

  import { Logger } from '~/services/logger.service';
  import { initServices } from '~/web/init-services';

  const { baseUrl, view }: AppProps = $props();

  onMount(() => {
    Logger.info('baseUrl:', baseUrl);
  });

</script>

<NeoThemeProvider>
  <NeoPortalContainer>
    <NeoSuspense promise={initServices(view)}>
      <NeoLazy component={import('~/components/header/HeaderComponent.svelte')} />
      <NeoLazy component={import('~/components/main/MainComponent.svelte')} />
    </NeoSuspense>
  </NeoPortalContainer>
</NeoThemeProvider>
