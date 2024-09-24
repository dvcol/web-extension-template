<script lang="ts">
  import { RouterContext, RouterView } from '@dvcol/svelte-simple-router/components';
  import { link } from '@dvcol/svelte-simple-router/router';
  import { transition } from '@dvcol/svelte-simple-router/utils';

  import svelteLogo from '~/assets/logo.svg';
  import { options, RouteName } from '~/router/routes';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('home');
</script>

<main class="home-container">
  <div>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>{i18n('title')}</h1>

  <RouterContext {options}>
    <a href={null} use:link={{ path: `/${RouteName.Hello}` }}>{RouteName.Hello}</a>
    <a href={`/${RouteName.Goodbye}`} use:link>{RouteName.Goodbye}</a>

    <div class="view">
      <RouterView {transition} />
    </div>
  </RouterContext>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework
    powered by Vite!
  </p>

  <p class="read-the-docs">{i18n('learn_more')}</p>
</main>

<style lang="scss">
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .logo {
    height: 6em;
    padding: 1.5em;
    transition: filter 300ms;
    will-change: filter;
  }

  .view {
    min-height: 10rem;
    padding: 2rem;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }

  .read-the-docs {
    color: #888;
  }
</style>
