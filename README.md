## English | [简体中文](./README-zh_CN.md)

# React micro-frontends component that loads vue
##### &emsp;&emsp;This is a single-spa based react micro front-end component
base on single-spa，you can load vue component in the react project

# Experience an demo
```
git clone git@github.com
cd mircro-tech
npm install
npm run start
```


# How to use
```js
npm install --save micro-tech
```
```js
  /** Load remote components **/
  import React from 'react';
  import VueFrame from 'micro-tech';
  const Test = () => (
    <div>
      <VueFrame jsurl="http://originPath/vueComponent.umd.js"/>
    </div>
  )
```
```js
  /** Load local components **/
  import React from 'react';
  import VueFrame from 'micro-tech';
  import VueComponent from './vueComponent.vue';
  const Test = () => (
    <div>
      <VueFrame componet={VueComponent} />
    </div>
  )
```
```js
  /** You can also load a remote react component **/
  import React from 'react';
  import { ReactFrame } from 'micro-tech';
  const Test = () => (
    <div>
      <ReactFrame jsurl="http://reactComponentAddress.umd.js" />
    </div>
  )
```
&emsp;&emsp;NOTE: Components development must use the **umd specification**.</br>
&emsp;&emsp;I recommend using "vue-cli" to write a "vue" component.
</br>
&emsp;&emsp;<a href="https://cli.vuejs.org/guide/build-targets.html#library" target="_blank">How to write a "vue" component with use "vue-cli"</a></br>
&emsp;&emsp;And you can use the<a href="https://github.com/y805939188/elf-cli" target="_blank"> elf-cli </a>to easily create a react component that meets the umd.
</br>

# Parameter
Only jsurl or component attributes are required, other parameters are optional
| parameter | type | need | features |
|:-|:-|:-|:-|
| jsurl | string | jsurl and component must be one of two | js script of the remote vue or react component |
| component | VueComponent | jsurl and component must be one of two | local vue component |
| extraProps | Object | not necessary | properties passed to the component |
| visible | boolean | not necessary | whether to show component |
| cssurl | string | not necessary | The address of the remote css. If determine that this address has a css file, you can use this property |
| name | string | not necessary | The name of the remote component |
| loadType | 'xhr' or 'script' | not necessary | The way to load remote components, using xhr has cross-domain risks. When there is cross-domain risks, it will be forced to use script loading. |

# Feature
- [x] Load remote vue components
- [x] Load local vue or react components
- [x] Cross domain loading
- [x] Static resource loading
- [x] css style isolation


# TODO
- [ ] Research if the component can be refactor with qiankun2.x
- [ ] Load the entire vue/react application from origin
- [ ] Render content to outside of the micro-frame. (At present, because of the react-vue-micro-frame be wrote with reference to primordial <iframe />, so the component can not render content to outside)
- [ ] design a pipeline to communication between the micro-frame and outside components. (This is necessary for scenarios with external using state management e.g. redux)

# Potential problem
1. The style isolation uses the shadow dom method, so temporarily does not support ie
2. Static resources only support resources that are loaded through the src attribute, such as image and other resources, without any processing. For resources like ttf, there may be cross-domain situations.
3. vue-cli will extract the css file separately by default, you can load the remote css through the cssurl property, or you can put the css into the js file by inline:
```js
/** vue-cli's vue.config.js */
module.exports = {
  css: {
    extract: false,
  },
}
```
4. Please try and mention more bugs, I will continue to improve. If it is convenient, please give a star by the way.
