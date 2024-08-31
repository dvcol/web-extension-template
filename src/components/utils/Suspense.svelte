<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';
  import { onMount } from 'svelte';

  import { writable } from 'svelte/store';

  import MatriceLoading from '~/components/loading/MatriceLoading.svelte';

  export let promise: Promise<unknown>;
  export let delay: number = 500;

  const loading = writable(!delay);

  onMount(async () => {
    if (!delay) return;
    await wait(delay);
    loading.set(true);
  });
</script>

{#await promise}
  {#if $loading}
    <slot name="loading" {promise}>
      <MatriceLoading />
    </slot>
  {/if}
{:then result}
  <slot {result} />
{:catch error}
  <slot name="error" {error} />
{/await}
