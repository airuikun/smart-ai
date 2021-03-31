import { registerApplication, start } from 'external-lib/index';
export const mountVueComponent = () => {start()};

const getBoolean = ((s) => () => (s = !s) && s)(true);

registerApplication(
  'vue', 
  () => import('./react-component/mirco-vue-component/index.js'),
  getBoolean,
);
