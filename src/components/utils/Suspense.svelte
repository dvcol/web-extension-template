<script lang="ts" module>
  import { type Snippet } from 'svelte';

  export type SuspenseProps<R = any, E = any> = {
    promise: Promise<R>;
    delay?: number;
    loading?: Snippet<[Promise<R>]>;
    result?: Snippet<[R]>;
    error?: Snippet<[E]>;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';
  import { onMount } from 'svelte';

  import MatriceLoading from '~/components/loading/MatriceLoading.svelte';

  const { promise, delay = 500, loading, result, error, children }: SuspenseProps = $props();

  let showLoading = $state(!delay);

  onMount(async () => {
    if (!delay) return;
    await wait(delay);
    showLoading = true;
  });
</script>

{#await promise}
  {#if showLoading}
    {#if loading}
      {@render loading(promise)}
    {:else}
      <MatriceLoading />
    {/if}
  {/if}
{:then resolved}
  {#if result}
    {@render result(resolved?.default)}
  {:else if children}
    {@render children()}
  {/if}
{:catch err}
  {#if error}
    {@render error(err)}
  {:else}
    <p style="color: red">{err?.message ?? err}</p>
    {#if err?.stack}
      <p style="color: red">{err.stack}</p>
    {/if}
  {/if}
{/await}
