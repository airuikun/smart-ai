import React from 'react';
import Vue from 'vue';
import { mountRootParcel } from 'single-spa';
import singleSpaVue from 'single-spa-vue';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __VUE_INTERNAL_INIT__ = Vue.prototype._init;

Vue.prototype._init = function (options) {
  /**
   * TODO: 留个口儿 用来以后支持加载整个Vue应用
   */
  __VUE_INTERNAL_INIT__.call(this, options);
};

var VueIframe =
/** @class */
function (_super) {
  __extends(VueIframe, _super);

  function VueIframe(props) {
    var _this_1 = _super.call(this, props) || this;

    _this_1.rootNodeWrapper = React.createRef(); // vue挂载节点是根据el再往上找它的爹

    _this_1.vueWrapper1 = document.createElement('div'); // 挂载vue以及隐藏vue需要两个节点

    _this_1.vueWrapper2 = document.createElement('div'); // 真正vue需要挂载的节点

    _this_1.styleElements = [];

    _this_1.initHack = function () {
      var originAppendChild = HTMLHeadElement.prototype.appendChild;
      var s = HTMLDocument.prototype;
      var selectorMap = {
        'getElementById': _this_1.initHackSelector('getElementById', s['getElementById']),
        'querySelector': _this_1.initHackSelector('querySelector', s['querySelector']),
        'querySelectorAll': _this_1.initHackSelector('querySelectorAll', s['querySelectorAll'])
      };
      _this_1.internalHackCSSsandbox = _this_1.internalHackCSSsandbox.bind(_this_1, originAppendChild);
      _this_1.internalHackSelector = _this_1.internalHackSelector.bind(_this_1, selectorMap);
    };

    _this_1.internalHackSelector = function (selectorMap, name, codeIsExecuting) {
      selectorMap[name](codeIsExecuting);
    };

    _this_1.componentDidMount = function () {
      return __awaiter(_this_1, void 0, void 0, function () {
        var rootEleWrapper, component, _a, lifecycles, supportShadowDOM;

        var _this_1 = this;

        var _b, _c;

        return __generator(this, function (_d) {
          switch (_d.label) {
            case 0:
              if (!this.currentUrl && !this.component) throw Error('组件必须接收一个url或者component属性');
              rootEleWrapper = this.rootNodeWrapper.current;
              if (!rootEleWrapper) throw Error('没有vue组件的root节点');
              _a = this.props.component;
              if (_a) return [3
              /*break*/
              , 2];
              return [4
              /*yield*/
              , this.getOriginVueComponent()];

            case 1:
              _a = _d.sent();
              _d.label = 2;

            case 2:
              component = _a;
              if (!this.isVueComponent(component)) return [2
              /*return*/
              ];
              lifecycles = this.registerVueComponent(this.vueWrapper2, component, this.currentName);
              this.parcel = mountRootParcel(lifecycles, {
                domElement: '-'
              });
              if (!this.visible) this.vueWrapper1.style.display = 'none';
              supportShadowDOM = !!rootEleWrapper.attachShadow;
              this.vueWrapper1.attachShadow({
                mode: 'open'
              });
              (_c = (_b = this.vueWrapper1) === null || _b === void 0 ? void 0 : _b.shadowRoot) === null || _c === void 0 ? void 0 : _c.appendChild(this.vueWrapper2); // if (supportShadowDOM) {
              //   setTimeout(() => {
              //     rootEleWrapper.attachShadow({ mode: 'open' });
              //     rootEleWrapper.shadowRoot?.appendChild(this.vueWrapper1);
              //   });
              // } else {
              //   rootEleWrapper.appendChild(this.vueWrapper1);
              // }

              rootEleWrapper.appendChild(this.vueWrapper1);
              setTimeout(function () {
                var _a;
                /**
                 * 对于一上来visible就是不可见的组件
                 * 先把display置为none 然后再添加进页面
                 * 这是为了防止vue组件中可能会有类似echarts
                 * 之类的工具会通过document.querySelector等
                 * 方法选择dom
                 * 如果直接就不把vue组件添加进页面的话
                 * vue组件内部那些选择dom的方法可能会产生问题
                 */


                if (!_this_1.visible) {
                  // if (supportShadowDOM) {
                  //   this.vueWrapper1 = rootEleWrapper?.
                  //     shadowRoot?.removeChild(this.vueWrapper1) as HTMLDivElement;
                  // } else {
                  _this_1.vueWrapper1 = (_a = rootEleWrapper) === null || _a === void 0 ? void 0 : _a.removeChild(_this_1.vueWrapper1); // }
                }

                _this_1.vueWrapper1.style.display = 'block';
              });
              return [2
              /*return*/
              ];
          }
        });
      });
    };

    _this_1.componentDidUpdate = function () {
      var _a, _b;

      var _c = _this_1.props.visible,
          visible = _c === void 0 ? true : _c;
      if (visible === _this_1.visible) return;
      _this_1.visible = visible;
      var rootNodeWrapper = _this_1.rootNodeWrapper.current;

      if (!visible) {
        _this_1.vueWrapper1 = (_a = rootNodeWrapper) === null || _a === void 0 ? void 0 : _a.removeChild(_this_1.vueWrapper1);
      } else {
        (_b = rootNodeWrapper) === null || _b === void 0 ? void 0 : _b.appendChild(_this_1.vueWrapper1);
      }
    };
    /**
     * componentWillUnmount被调用时候不一定就是出错
     * 但是贸然地在react项目中挂载vue组件可能出现问题
     * 当出现问题的时候react组件会被卸载 此时会调用componentWillUnmount
     * 这个时候应该确认下项目是否还正常运行(八成报错)
     */


    _this_1.componentWillUnmount = function () {
      _this_1.rootNodeWrapper.current.removeChild(_this_1.vueWrapper1);

      _this_1.vueWrapper1 = null;
      _this_1.vueWrapper2 = null;

      _this_1.parcel.unmount();
    };

    _this_1.initHackSelector = function (name, originSelectorFn) {
      return function (codeIsExecuting) {
        var HTMLDocumentPrototype = HTMLDocument.prototype;
        if (!codeIsExecuting) HTMLDocumentPrototype[name] = originSelectorFn;
        var _this = _this_1;

        HTMLDocumentPrototype[name] = function (id) {
          return originSelectorFn.call(this, id) || _this.vueWrapper1.shadowRoot && _this.vueWrapper1.shadowRoot[name] && _this.vueWrapper1.shadowRoot[name](id);
        };
      };
    };

    _this_1.internalHackCSSsandbox = function (originAppendChild, codeIsExecuting) {
      var _a;
      /**
       * css 沙箱基于shadow dom
       * 如果浏览器版本不支持shadow dom 那就不玩了
       */


      if (!((_a = _this_1.rootNodeWrapper.current) === null || _a === void 0 ? void 0 : _a.attachShadow)) return;
      if (!codeIsExecuting) HTMLHeadElement.prototype.appendChild = originAppendChild;
      var LINK_TAG_NAME = 'LINK';
      var STYLE_TAG_NAME = 'STYLE';
      var _this = _this_1;

      HTMLHeadElement.prototype.appendChild = function (newChild) {
        var element = newChild;

        if (element.tagName) {
          switch (element.tagName) {
            case LINK_TAG_NAME:
            case STYLE_TAG_NAME:
              {
                _this.styleElements.push(element);

                return originAppendChild.call(this, element.cloneNode());
              }
          }
        }

        return originAppendChild.call(this, element);
      };
    };

    _this_1.internalHackJSSelector = function (originAppendChild, selectorList, codeIsExecuting) {
      selectorList.forEach(function (selectorName) {});
    };

    _this_1.registerVueComponent = function (el, vueComponent, id) {
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
              props: __assign({}, _this_1.props.extraProps)
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

    _this_1.isVueComponent = function (component) {
      return component && _typeof(component) === 'object' && typeof component.render === 'function';
    };

    _this_1.getOriginCode = function (url, method, data) {
      if (method === void 0) {
        method = 'GET';
      }

      return new Promise(function (res, rej) {
        var xhr = XMLHttpRequest ? new XMLHttpRequest() : ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : null;
        if (method === 'GET' && data) data && (url += "?" + data);
        xhr.open(method, url, true);

        if (method == 'GET') {
          xhr.send();
        } else {
          xhr.setRequestHeader('content-type', 'text/plain');
          xhr.send(data);
        }

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) res(xhr.responseText);else rej(xhr);
          }
        };
      });
    };

    _this_1.getCurrentName = function (self) {
      for (var props in self) {
        if (!self.hasOwnProperty(props)) break;
        if (props !== 'Vue') return props;
      }

      return '';
    };

    _this_1.executeOriginCode = function (code) {
      var internalSelf = {
        Vue: Vue
      };
      var reg = _this_1.publicPathReg;
      var publicPath = _this_1.currentPublicPath;
      var url = _this_1.currentUrl;

      if (reg.test(code)) {
        /**
         * 自己开发组件的时候使用可以配置publicPath
         * 为了让react-vue-mirco-frame支持加载静态资源
         * 可以给publicPath设置为一个约定好的值
         * 然后这里用传进来的origin替换掉这个约定好的值
         * 这个约定好的值默认是 __WILL_BE_REPLACED_PUBLIC_PATH__
         */
        var codeStr = code.replace(reg, publicPath);
        var originCodeFn = new Function("self", codeStr);
        originCodeFn(internalSelf);
      } else {
        /**
         * 如果没有配置这个值的话 就以hack的方式注入origin
         * webpack打包出来的umd代码里面会动态监测document.currentScript
         * 通过临时给这个currentScript换掉的方式让webpack将origin注入进代码
         */
        var temporaryDocument = window.document;
        var originCurrentScript = window.document.currentScript;
        var temporaryScript = document.createElement('script');
        var defineProperty = Object.defineProperty;
        temporaryScript.src = url;
        defineProperty(temporaryDocument, 'currentScript', {
          value: temporaryScript,
          writable: true
        });
        var originCodeFn = new Function("self", code);
        originCodeFn(internalSelf);
        defineProperty(temporaryDocument, 'currentScript', {
          value: originCurrentScript,
          writable: false
        });
        temporaryScript.remove && temporaryScript.remove();
      }
      return internalSelf;
    };

    _this_1.getOriginVueComponent = function () {
      if (_this_1.loadType === 'script') {
        return new Promise(function (res) {
          /**
           * script标签没有defer或async的时候
           * 下载数据以及执行都是同步的
           */
          _this_1.internalHackCSSsandbox(true);

          _this_1.internalHackSelector('getElementById', true);

          _this_1.internalHackSelector('querySelector', true);

          _this_1.internalHackSelector('querySelectorAll', true);

          var type = 'text/javascript';
          var oScript1 = document.createElement('script');
          oScript1.type = type;
          var originSelf = window.self;
          oScript1.innerText = 'window.self = {Vue: null}';
          document.body.appendChild(oScript1);
          window.self.Vue = Vue;
          var oScript2 = document.createElement('script');
          oScript2.type = type;
          oScript2.src = _this_1.currentUrl;
          document.body.appendChild(oScript2);

          oScript2.onload = function () {
            var _a, _b;

            _this_1.internalHackCSSsandbox(false);

            _this_1.internalHackSelector('getElementById', false);

            _this_1.internalHackSelector('querySelector', false);

            _this_1.internalHackSelector('querySelectorAll', false);

            var currentSelf = window.self;
            window.self = originSelf;
            if (!_this_1.currentName) _this_1.currentName = _this_1.getCurrentName(currentSelf);
            if (!_this_1.currentName) throw Error('没有获取到vue组件, 造成问题的原因可能是远程组件并未遵循umd规范');
            _this_1.vueWrapper2.id = _this_1.currentName;
            _this_1.component = currentSelf[_this_1.currentName];
            (_a = oScript1.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(oScript1);
            (_b = oScript2.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(oScript2);
            res(_this_1.component);
          };
        });
      } else {
        return new Promise(function (res) {
          _this_1.getOriginCode(_this_1.currentUrl).then(function (data) {
            /**
             * 通过XMLHttpRequest获取源代码
             */
            if (!data || typeof data !== 'string') throw Error('没有加载到远程vue组件');

            _this_1.internalHackCSSsandbox(true);

            _this_1.internalHackSelector('getElementById', true);

            _this_1.internalHackSelector('querySelector', true);

            _this_1.internalHackSelector('querySelectorAll', true);

            var internalSelf = _this_1.executeOriginCode(data);

            _this_1.internalHackCSSsandbox(false);

            _this_1.internalHackSelector('getElementById', true);

            _this_1.internalHackSelector('querySelector', true);

            _this_1.internalHackSelector('querySelectorAll', true);

            if (!_this_1.currentName) _this_1.currentName = _this_1.getCurrentName(internalSelf);
            if (!_this_1.currentName) throw Error('没有获取到vue组件, 造成问题的原因可能是远程组件并未遵循umd规范');
            _this_1.vueWrapper2.id = _this_1.currentName;
            _this_1.component = internalSelf[_this_1.currentName];
            res(_this_1.component);
          }).catch(function (err) {
            /**
             * 如果进入到这里说明可能请求出错了
             */
            console.warn('远程vue组件请求可能出现跨域或其他网络问题');
            /**
             * 如果出现跨域问题就强制使用script方式加载一遍
             */

            _this_1.loadType = 'script';
            res(_this_1.getOriginVueComponent());
          });
        });
      }
    };

    _this_1.render = function () {
      return React.createElement("div", {
        id: _this_1.props.id || '',
        ref: _this_1.rootNodeWrapper
      });
    };

    var loadType = props.loadType,
        url = props.url,
        component = props.component,
        name = props.name,
        visible = props.visible,
        instable_publicPathBeReplacedKey = props.instable_publicPathBeReplacedKey;
    _this_1.loadType = loadType || 'script'; // 初始化时候是否显示

    _this_1.visible = typeof visible === 'boolean' ? visible : true; // 获取到外部传进来的vue组件

    _this_1.component = component; // 获取到外部传来的url

    _this_1.currentUrl = url || ''; // 这个属性是用来标识要替换远程源代码中的publicPath的关键字

    _this_1.publicPathKey = instable_publicPathBeReplacedKey || '__WILL_BE_REPLACED_PUBLIC_PATH__'; // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉

    _this_1.publicPathReg = new RegExp(_this_1.publicPathKey, 'g'); // 生成每个iframe的唯一表示

    _this_1.currentName = name || ''; // 获取传进来的url的协议+域名+端口

    _this_1.currentPublicPath = (new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i').exec(_this_1.currentUrl) || [''])[0] + "/"; // vue会挂载到这个节点2上

    _this_1.vueWrapper2.id = _this_1.currentName; // 节点1是为了可以让vue随时visibility 同时使vue的根节点脱离react的fiber树
    // this.vueWrapper1.appendChild(this.vueWrapper2);
    // 临时保存appendChild

    _this_1.initHack();

    return _this_1; // const originAppendChild = HTMLHeadElement.prototype.appendChild;
    // const originSelector = HTMLDocument.prototype;
    // const selectorMap = {
    //   'getElementById': this.internalHackSelector('getElementById', originSelector['getElementById']),
    //   'querySelector': this.internalHackSelector('querySelector', originSelector['querySelector']),
    //   'querySelectorAll': this.internalHackSelector('querySelectorAll', originSelector['querySelectorAll']),
    // };
    // (this.internalHackCSSsandbox as Function) =
    //   this.internalHackCSSsandbox.bind(this, originAppendChild);
    // (this.internalHackJSSelector as Function) =
    //   this.internalHackJSSelector.bind(this, originSelector, selectorList);
    // selectorList.forEach(selectorName => {
    // });
    // (elementId: string): HTMLElement | null
    // const originGetElementById = originSelector['getElementById'];
    // const _this = this;
    // HTMLDocument.prototype.getElementById = function (id: string): HTMLElement | null {
    //   console.log('88888 进来了了饿了来了')
    //   const el = originGetElementById.call(this, id) ||
    //     (_this.vueWrapper1.shadowRoot?.getElementById(id) as HTMLElement | null);
    //   return el;
    // }
  }

  return VueIframe;
}(React.PureComponent);

export default VueIframe;
//# sourceMappingURL=index.js.map
