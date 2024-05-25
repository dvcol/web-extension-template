import { mountVueApp } from '~/main';
import AppComponent from '~/components/AppComponent.vue';

mountVueApp('#app-popup', AppComponent)

console.info('Mounted')