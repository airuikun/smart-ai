import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import Hello from './component/index.vue';

// const oEl = document.querySelector("#vue");

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    el: '#vue',
    // el: () => oEl,
    render: r => r(Hello)
  } 
});

export const bootstrap = [
  vueLifecycles.bootstrap,
];

export const mount = [
  vueLifecycles.mount,
];

export const unmount = [
  vueLifecycles.unmount,
];
