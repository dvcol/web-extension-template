<script lang="ts">
  import Router, { link } from 'svelte-spa-router';

  import svelteLogo from '~/assets/logo.svg';
  import { routeDefinition, routeMap } from '~/router/routes';
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

  {#each routeMap as route}
    <a href={null} use:link={route.path}>{route.name}</a>
  {/each}

  <div class="card">
    <Router routes={routeDefinition} />
  </div>

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
