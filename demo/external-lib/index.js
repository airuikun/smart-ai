import React from 'react';
import Vue from 'vue';
import { registerApplication, start } from 'single-spa';
import singleSpaVue from 'single-spa-vue';
import axios from 'axios';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var registerVueComponent = function registerVueComponent(id, vueComponent) {
  var vueInstance = singleSpaVue({
    Vue: Vue,
    appOptions: {
      el: "#" + id,
      render: function render(h) {
        return h('div', {
          attrs: {
            id: id
          }
        }, [h(vueComponent)]);
      }
    }
  });
  return {
    bootstrap: vueInstance.bootstrap,
    mount: vueInstance.mount,
    unmount: vueInstance.unmount
  };
};

var VueIframe =
/** @class */
function (_super) {
  __extends(VueIframe, _super);

  function VueIframe(props) {
    var _this = _super.call(this, props) || this;

    _this.isMount = false; // 是否挂载

    _this.currentUrl = ''; // 传进来的url

    _this.currentPublicPath = ''; // 传进来的url的协议+域名+端口

    _this.publicPathKey = ''; // 远程源代码中要被替换的关键字

    _this.componentDidMount = function () {
      registerApplication(_this.currentName, function () {
        return new Promise(function (resolve, reject) {
          axios.get(_this.currentUrl).then(function (_a) {
            var data = _a.data;
            if (!data) reject('获取远程代码出现了错误'); // 这里由于自定义了webpack中的self
            // 所以需要给这个self里头传递一个Vue对象

            var internalSelf = {
              Vue: Vue
            };
            /**
             * 这里用传进来的url的origin替换掉源代码中webpack生成的publicPath
             * 否则的话一般vue打包出来的组件的publicPath都是 '/'
             * 直接在这里执行的话就会默认指向当前域然后会404
             * 所以这里希望组件开发的时候将publicPath设置为一个约定好的key
             * 这里用真正的远程路径替换
             */

            var codeStr = (data || '').replace(_this.publicPathReg, _this.currentPublicPath);
            var originCodeFn = new Function("self", codeStr);
            originCodeFn(internalSelf);
            var currentComponent = internalSelf[_this.currentName];
            var lifecycles = registerVueComponent(_this.currentName, currentComponent);
            resolve(lifecycles);
          });
        });
      }, _this.getBoolean);
      if (_this.props.activation) _this.mount();
    };

    _this.componentDidUpdate = function () {
      return _this.props.activation ? _this.mount() : _this.unmount();
    };

    _this.getBoolean = function () {
      return _this.isMount;
    };

    _this.mount = function () {
      return (_this.isMount = true) && start();
    };

    _this.unmount = function () {
      return (_this.isMount = false) || start();
    };

    var url = props.url,
        publicPathWillBeReplacedKeyWord = props.publicPathWillBeReplacedKeyWord; // 获取到外部传来的url

    _this.currentUrl = url; // 这个属性是用来标识要替换远程源代码中的publicPath的关键字

    _this.publicPathKey = publicPathWillBeReplacedKeyWord || '__WILL_BE_REPLACED_PUBLIC_PATH__'; // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉

    _this.publicPathReg = new RegExp(_this.publicPathKey, 'g'); // 生成每个iframe的唯一表示

    _this.currentName = String(props.name || +new Date()); // 获取传进来的url的协议+域名+端口

    _this.currentPublicPath = (new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i').exec(_this.currentUrl) || [''])[0] + "/";
    return _this;
  }

  VueIframe.prototype.render = function () {
    return React.createElement("div", {
      id: this.currentName
    });
  };

  return VueIframe;
}(React.Component);

export default VueIframe;
//# sourceMappingURL=index.js.map
