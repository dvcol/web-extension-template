<script lang="ts" module>
  import type { Component, Snippet } from 'svelte';
  import type { SuspenseProps } from '~/components/utils/Suspense.svelte';

  export type LazyComponentProps = {
    component: Promise<{ default: Component<any, any, any> }>;
    props?: Record<string, any>;
    children?: Snippet;
  } & Pick<SuspenseProps<{ default: Component<any, any, any> }>, 'loading' | 'error'>;
</script>

<script lang="ts">
  import Suspense from '~/components/utils/Suspense.svelte';

  const { component, props: _props, loading, error, children }: LazyComponentProps = $props();
</script>

<Suspense promise={component} {loading} {error}>
  {#snippet result(Component)}
    <Component {..._props}>
      {@render children?.()}
    </Component>
  {/snippet}
</Suspense>
