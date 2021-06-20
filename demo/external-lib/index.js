import React from 'react';
import Vue from 'vue';
import { mountRootParcel } from 'single-spa';
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var __VUE_INTERNAL_INIT__ = Vue.prototype._init;

Vue.prototype._init = function (options) {
  /**
   * TODO: 留个口儿 用来以后支持加载整个Vue应用(目前只支持加载组件)
   */
  __VUE_INTERNAL_INIT__.call(this, options);
};

var VueIframe =
/** @class */
function (_super) {
  __extends(VueIframe, _super);

  function VueIframe(props) {
    var _this = _super.call(this, props) || this; // private rootNode: HTMLDivElement = document.createElement('div'); // vue组件挂载的root


    _this.rootNodeWrapper = React.createRef(); // vue挂载节点是根据el再往上找它的爹

    _this.vueWrapper1 = document.createElement('div');
    _this.vueWrapper2 = document.createElement('div');

    _this.registerVueComponent = function (el, vueComponent, id) {
      var vueInstance = singleSpaVue({
        Vue: Vue,
        appOptions: {
          el: typeof el === 'string' ? "#" + el : el,
          render: function render(h) {
            return h('div', {
              attrs: {
                id: id
              }
            }, [h(vueComponent, {
              props: __assign({}, _this.props.extraProps)
            })]);
          }
        }
      });
      return {
        bootstrap: vueInstance.bootstrap,
        mount: vueInstance.mount,
        unmount: vueInstance.unmount
      };
    };

    _this.componentDidUpdate = function () {
      var _a, _b;

      var _c = _this.props.visible,
          visible = _c === void 0 ? true : _c;
      if (visible === _this.visible) return;
      _this.visible = visible;
      var rootNodeWrapper = _this.rootNodeWrapper.current;

      if (!visible) {
        _this.vueWrapper1 = (_a = rootNodeWrapper) === null || _a === void 0 ? void 0 : _a.removeChild(_this.vueWrapper1);
      } else {
        (_b = rootNodeWrapper) === null || _b === void 0 ? void 0 : _b.appendChild(_this.vueWrapper1);
      }
    };
    /**
     * componentWillUnmount被调用时候不一定就是出错
     * 但是贸然地在react项目中挂载vue组件可能出现问题
     * 当出现问题的时候react组件会被卸载 此时会调用componentWillUnmount
     * 这个时候应该确认下项目是否还正常运行(八成报错)
     */


    _this.componentWillUnmount = function () {
      var _a;

      _this.vueWrapper1 = null;
      _this.vueWrapper2 = null;
      (_a = _this.rootNodeWrapper.current) === null || _a === void 0 ? void 0 : _a.removeChild(_this.vueWrapper1);

      _this.parcel.unmount();
    };

    _this.componentDidMount = function () {
      axios.get(_this.currentUrl).then(function (_a) {
        var data = _a.data;
        if (!data) throw Error('没有加载到远程vue组件');
        var internalSelf = {
          Vue: Vue
        };
        var rootEleWrapper = _this.rootNodeWrapper.current;
        if (!rootEleWrapper) throw Error('没有vue组件的root节点');
        if (_this.visible) rootEleWrapper.appendChild(_this.vueWrapper1);
        var codeStr = (data || '').replace(_this.publicPathReg, _this.currentPublicPath);
        var originCodeFn = new Function("self", codeStr);
        originCodeFn(internalSelf);
        var currentComponent = internalSelf[_this.currentName];

        var lifecycles = _this.registerVueComponent(_this.vueWrapper2, currentComponent, _this.currentName);

        _this.parcel = mountRootParcel(lifecycles, {
          domElement: '-'
        });
      }); // mountRootParcel()
      // registerApplication(
      //   this.currentName, 
      //   (): Promise<LifeCycles<{}>> => {
      //     return new Promise(resolve => {
      //       const oScript = document.createElement('script');
      //       oScript.type = 'text/javascript';
      //       oScript.innerText = `var self = {Vue: null}`;
      //       document.body.appendChild(oScript);
      //       self.Vue = Vue;
      //       const oScript2 = document.createElement('script');
      //       oScript2.type = 'text/javascript';
      //       oScript2.src = this.currentUrl;
      //       document.body.appendChild(oScript2);
      //       oScript2.onload = () => {
      //         const _self: any = self;
      //         const currentComponent = _self[this.currentName];
      //         console.log(556677, currentComponent);
      //       }
      //       // axios.get(this.currentUrl).then(({ data }) => {
      //       //   if (!data) throw Error('没有加载到远程vue组件');
      //       //   /**
      //       //    * 这里由于自定义了webpack中的self
      //       //    * 所以需要给这个self里头传递一个Vue对象
      //       //    */
      //       //   const internalSelf: any = { Vue };
      //       //   const rootEleWrapper = this.rootNodeWrapper.current;
      //       //   if (!rootEleWrapper) throw Error('没有vue组件的root节点');
      //       //   /**
      //       //    * 直接在react渲染的节点下渲染vue组件会发生严重错误
      //       //    * 具体错误原因暂时未知
      //       //    * 所以需要手动创建一个节点后插入
      //       //    */
      //       //   rootEleWrapper.appendChild(this.rootNode);
      //       //   /**
      //       //    * 这里用传进来的url的origin替换掉源代码中webpack生成的publicPath
      //       //    * 否则的话一般vue打包出来的组件的publicPath都是 '/'
      //       //    * 直接在这里执行的话就会默认指向当前域然后会404
      //       //    * 所以这里希望组件开发的时候将publicPath设置为一个约定好的key
      //       //    * 这里用真正的远程路径替换
      //       //    */
      //       //   const codeStr = (data || '').replace(this.publicPathReg, this.currentPublicPath);
      //       //   const originCodeFn = new Function("self", codeStr);
      //       //   originCodeFn(internalSelf);
      //       //   const currentComponent = internalSelf[this.currentName];
      //       //   const lifecycles = this.registerVueComponent(this.currentName, currentComponent);
      //       //   resolve(lifecycles);
      //       // })
      //     })
      //   },
      //   this.getBoolean,
      // );
      // if (this.props.activation) this.mount();
    };

    _this.render = function () {
      return React.createElement("div", {
        ref: _this.rootNodeWrapper
      });
    };

    var url = props.url,
        name = props.name,
        visible = props.visible,
        publicPathWillBeReplacedKeyWord = props.publicPathWillBeReplacedKeyWord; // 初始化时候是否显示

    _this.visible = typeof visible === 'boolean' ? visible : true; // 获取到外部传来的url

    _this.currentUrl = url; // 这个属性是用来标识要替换远程源代码中的publicPath的关键字

    _this.publicPathKey = publicPathWillBeReplacedKeyWord || '__WILL_BE_REPLACED_PUBLIC_PATH__'; // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉

    _this.publicPathReg = new RegExp(_this.publicPathKey, 'g'); // 生成每个iframe的唯一表示

    _this.currentName = String(name || +new Date()); // 获取传进来的url的协议+域名+端口

    _this.currentPublicPath = (new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i').exec(_this.currentUrl) || [''])[0] + "/"; // 设置一个内部的挂载节点

    _this.vueWrapper2.id = _this.currentName;

    _this.vueWrapper1.appendChild(_this.vueWrapper2);

    return _this;
  }

  return VueIframe;
}(React.PureComponent);

export default VueIframe;
//# sourceMappingURL=index.js.map
