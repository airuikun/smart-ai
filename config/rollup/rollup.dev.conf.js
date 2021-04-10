import clear from 'rollup-plugin-clear';
import merge from 'lodash/merge';
import rollupBaseConf from './rollup.base.conf';
// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload';

const originPath = process.cwd();
const devConfig = {
  output: {
    file: `${originPath}/demo/external-lib/index.js`,
    name: 'react-vue-mirco-frame',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    // clear({
    //   targets: [`${originPath}/demo/external-lib`],
    // })
    // serve({
    //   open: true,
    //   contentBase: `${originPath}/demo`,
    //   host: 'localhost',
    //   port: 3190,
    // }),
    // livereload(),
  ]
};

const config = merge(rollupBaseConf, devConfig);

export default config;
