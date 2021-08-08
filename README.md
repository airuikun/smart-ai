## English | [简体中文](./README-zh_CN.md)

# React micro-frontends component that loads vue
##### &emsp;&emsp;This is a single-spa based react micro front-end component
&emsp;&emsp;I have a dream, I hope that can load a components of other frameworks as simple as loading a ```<iframe>``` tag in a react project.
</br>

# Experience an demo
```
git clone git@github.com:y805939188/react-vue-micro-frame.git
cd react-vue-micro-frame
npm install
npm run start
```


# How to use
```js
npm install --save react-vue-micro-frame
```
```js
  /** Load remote components **/
  import React from 'react';
  import VueFrame from 'react-vue-micro-frame';
  const Test = () => (
    <div>
      <VueFrame jsurl="http://originPath/vueComponent.umd.js"/>
    </div>
  )
```
```js
  /** Load local components **/
  import React from 'react';
  import VueFrame from 'react-vue-micro-frame';
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
  import { ReactFrame } from 'react-vue-micro-frame';
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
&emsp;&emsp;<a href="https://www.npmjs.com/package/shin-cli" target="_blank">And you can use the "shin-cli" to easily create a react component that meets the umd.</a>
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
- [ ] Load the entire vue application

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
