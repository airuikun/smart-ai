# React加载vue的微前端组件

&emsp;&emsp;可以在react项目中像加载一个 <iframe> 标签一样简单的加载一个远程vue组件
</br>

&emsp;&emsp;vue组件的开发请务必使用**umd规范**开发。
建议使用vue-cli提供的<a href="https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%94%E7%94%A8" target="_blank">构建库</a>的功能

(```js)
  import React, { useState } from 'react';
  const Test = () => (
    const [active, setActive] = useState(true);
    <VueIFrame
      url="http://originPath/vueComponent.umd.js"
      name="vueComponent1"
      activation={active}
    />
  )
(```)</br>
url接收的是远程服务器上的vue组件(请遵循umd规范)</br>
