import AppComponent from '~/components/AppComponent.vue';
import { mountVueApp } from '~/main';

mountVueApp('#app-popup', AppComponent);

console.info('Mounted');
