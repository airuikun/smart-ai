import Vue from 'vue';
// import 
import singleSpaVue from 'single-spa-vue';

export const registerVueComponent = (id, vueComponent) => {
  const vueInstance = singleSpaVue({ 
    Vue,
    appOptions: {
      el: `#${id}`, 
      // render: r => r(vueComponent)
      render: h => h('div', { attrs: { id: id } }, [h(vueComponent)])
    }
  });
  return ({
    bootstrap: vueInstance.bootstrap,
    mount: vueInstance.mount,
    unmount: vueInstance.unmount,
  })
}
