import Vue from 'vue';
import 'css.escape';
import React from 'react';
import { mountRootParcel } from 'single-spa';
import uniqueId from 'lodash/uniqueId';
import equal from 'lodash/eq';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

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

var defaultOpts = {
  // required opts
  Vue: null,
  appOptions: null,
  template: null
};
function singleSpaVue(userOpts) {
  if (_typeof(userOpts) !== "object") {
    throw new Error("single-spa-vue requires a configuration object");
  }

  var opts = __assign(__assign({}, defaultOpts), userOpts);

  if (!opts.Vue) {
    throw new Error("single-spa-vuejs must be passed opts.Vue");
  }

  if (!opts.appOptions) {
    throw new Error("single-spa-vuejs must be passed opts.appOptions");
  } // Just a shared object to store the mounted object state


  var mountedInstances = {};
  return {
    bootstrap: bootstrap.bind(null, opts, mountedInstances),
    mount: mount.bind(null, opts, mountedInstances),
    unmount: unmount.bind(null, opts, mountedInstances),
    update: update.bind(null, opts, mountedInstances)
  };
}

function bootstrap(opts) {
  if (opts.loadRootComponent) {
    return opts.loadRootComponent().then(function (root) {
      return opts.rootComponent = root;
    });
  } else {
    return Promise.resolve();
  }
}

function mount(opts, mountedInstances, props) {
  return Promise.resolve().then(function () {
    var appOptions = __assign({}, opts.appOptions);

    if (props.domElement && !appOptions.el) {
      appOptions.el = props.domElement;
    }

    if (!appOptions.el) {
      var htmlId = "single-spa-application:" + props.name;
      appOptions.el = "#" + CSS.escape(htmlId) + " .single-spa-container";
      var domEl = document.getElementById(htmlId);

      if (!domEl) {
        domEl = document.createElement("div");
        domEl.id = htmlId;
        document.body.appendChild(domEl);
      } // single-spa-vue@>=2 always REPLACES the `el` instead of appending to it.
      // We want domEl to stick around and not be replaced. So we tell Vue to mount
      // into a container div inside of the main domEl


      if (!domEl.querySelector(".single-spa-container")) {
        var singleSpaContainer = document.createElement("div");
        singleSpaContainer.className = "single-spa-container";
        domEl.appendChild(singleSpaContainer);
      }

      mountedInstances.domEl = domEl;
    }

    if (!appOptions.render && !appOptions.template && opts.rootComponent) {
      appOptions.render = function (h) {
        return h(opts.rootComponent);
      };
    }

    if (!appOptions.data) {
      appOptions.data = {};
    }

    appOptions.data = __assign(__assign({}, appOptions.data), props);
    mountedInstances.instance = new opts.Vue(appOptions);

    if (mountedInstances.instance.bind) {
      mountedInstances.instance = mountedInstances.instance.bind(mountedInstances.instance);
    }

    return mountedInstances.instance;
  });
}

function update(opts, mountedInstances, props) {
  return Promise.resolve().then(function () {
    var data = __assign(__assign({}, opts.appOptions.data || {}), props);

    for (var prop in data) {
      mountedInstances.instance[prop] = data[prop];
    }
  });
}

function unmount(opts, mountedInstances) {
  return Promise.resolve().then(function () {
    mountedInstances.instance.$destroy();
    mountedInstances.instance.$el.innerHTML = "";
    delete mountedInstances.instance;

    if (mountedInstances.domEl) {
      mountedInstances.domEl.innerHTML = "";
      delete mountedInstances.domEl;
    }
  });
}

/**
 * toolFunction()的时候会返回一个boolean 表示当前是否有vue代码正在运行
 * toolFunction(-1)的时候会返回所有的ele
 * toolFunction(element)的时候表示这个元素对应的vue组件代码正在运行
 * toolFunction(number)的时候表示要获取这个id对应的element
 * toolFunction(number, false)表示把这个id对应的状态设置为false
 * toolFunction(number, -1)表示把这个id对应的删除并返回是否所有的都unmount了
 *
 * 1. 啥也不传返回obj里所有属性对应的对象的status属性是否起码有一个为true
 * 2. 只传一个参数并且是-1的时候把所有的ele返回
 * 3. 只传一个参数并且是divElement的话就往obj添加一个对象同时返回runId
 * 4. 只传一个参数并且是number类型的话, 就返回这个runId对应divElement
 * 5. 传俩参数并且第一个是number, 第二个是false的话就把这个id对应的对象status改为false
 * 6. 传进来俩参数第一个是number, 第二个是-1的话, 就把这个id对应的删除
 */

var toolFunction = function (obj, id) {
  return function (a, b) {
    var length = arguments.length;

    if (!length) {
      if (!Object.keys(obj).length) return false;
      return Object.values(obj).some(function (item) {
        return item.running;
      });
    } else if (length === 1 && a === -1) {
      return Object.values(obj).map(function (item) {
        return item.ele;
      });
    } else if (length === 1 && a instanceof HTMLElement) {
      obj[id++] = {
        running: true,
        ele: a
      };
      return id - 1;
    } else if (length === 1 && typeof a === 'number') {
      return obj[a].ele;
    } else if (length === 2 && typeof a === 'number' && b === false) {
      obj[a].running = false;
      return obj[a].ele;
    } else if (length === 2 && typeof a === 'number' && b === -1) {
      delete obj[a];
      return !Object.keys(obj).length;
    }

    throw Error('传参有问题');
  };
}({}, 0);

var getWrapper = function (obj) {
  return function (name, ele) {
    if (name && ele) obj[name] = ele;else if (name && !ele) return obj[name];
  };
}({});

var originSelectors = HTMLDocument.prototype;
var originAppendChild = HTMLHeadElement.prototype.appendChild;
var originModule = window.module;
var originRequire = window.require;
var originExports = window.exports;
var LINK_TAG_NAME = 'LINK';
var STYLE_TAG_NAME = 'STYLE';

var hackSelector = function hackSelector(name, originSelectorFn) {
  return function (cancelHack) {
    var HTMLDocumentPrototype = HTMLDocument.prototype;
    if (cancelHack) return HTMLDocumentPrototype[name] = originSelectorFn;

    HTMLDocumentPrototype[name] = function (id) {
      var originEl = originSelectorFn.call(this, id);
      if (originEl) return originEl;

      if (!originEl) {
        var allShadowRoot = toolFunction(-1);
        var len = allShadowRoot.length;

        for (var i = 0; i < len; i++) {
          var wrapper = allShadowRoot[i];
          var shadowEl = wrapper && wrapper.shadowRoot && wrapper.shadowRoot[name] && typeof wrapper.shadowRoot[name] === 'function' && wrapper.shadowRoot[name](id);
          if (shadowEl) return shadowEl;
        }
      }

      return null;
    };
  };
};

var selectorMap = {
  'getElementById': hackSelector('getElementById', originSelectors['getElementById']),
  'querySelector': hackSelector('querySelector', originSelectors['querySelector']),
  'querySelectorAll': hackSelector('querySelectorAll', originSelectors['querySelectorAll'])
};

var initSelectorHack = function initSelectorHack() {
  selectorMap.getElementById();
  selectorMap.querySelector();
  selectorMap.querySelectorAll();
};

var initAppendChildHack = function initAppendChildHack() {
  HTMLHeadElement.prototype.appendChild = function (newChild) {
    var _a;

    var element = newChild;

    if (element.tagName) {
      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME:
          {
            var currentScript = document.currentScript;
            /** 获取到currentName */

            var currentName_1 = (_a = currentScript) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id');
            if (!currentName_1) return originAppendChild.call(this, element);
            setTimeout(function () {
              var _a, _b;

              (_b = (_a = getWrapper(currentName_1)) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(element);
            });
          }
      }
    }

    return originAppendChild.call(this, element);
  };
};

var httpReg = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

var VueIframe =
/** @class */
function (_super) {
  __extends(VueIframe, _super);

  function VueIframe(props) {
    var _this = _super.call(this, props) || this;

    _this.rootNodeWrapper = React.createRef(); // vue挂载节点是根据el再往上找它的爹

    _this.oWrapper1 = document.createElement('div'); // 挂载vue以及隐藏vue需要两个节点

    _this.oWrapper2 = document.createElement('div'); // 真正vue需要挂载的节点

    _this.styleElements = []; // 用来临时存放要被添加的style标签

    _this.runId = -1; // 当前正在跑的vue组件的runId 唯一

    _this.componentDidMount = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var rootEleWrapper, component, _a;

        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              if (!this.currentUrl && !this.component) throw Error('组件必须接收一个url或者component属性');
              rootEleWrapper = this.rootNodeWrapper.current;
              if (!rootEleWrapper) throw Error('没有组件的root节点');
              if (!this.isLocal) return [3
              /*break*/
              , 1];
              _a = this.component;
              return [3
              /*break*/
              , 3];

            case 1:
              return [4
              /*yield*/
              , this.getOriginComponent()];

            case 2:
              _a = _b.sent();
              _b.label = 3;

            case 3:
              component = _a;
              window._test = component;
              if (!this.isComponent(component)) return [2
              /*return*/
              ];
              this.registerComponentAndMount(component);
              this.addComponentToPage(rootEleWrapper, this.isLocal);
              return [2
              /*return*/
              ];
          }
        });
      });
    };

    _this.componentDidUpdate = function () {
      var _a, _b, _c;

      var _d = _this.props,
          _e = _d.visible,
          visible = _e === void 0 ? true : _e,
          extraProps = _d.extraProps;

      if (!(visible === _this.visible)) {
        _this.visible = visible;
        var rootNodeWrapper = _this.rootNodeWrapper.current;

        if (!visible) {
          if ((_a = rootNodeWrapper) === null || _a === void 0 ? void 0 : _a.contains(_this.oWrapper1)) {
            _this.oWrapper1 = (_b = rootNodeWrapper) === null || _b === void 0 ? void 0 : _b.removeChild(_this.oWrapper1);
          } else {
            console.warn('无法卸载该组件, 发生错误的原因可能是没有加载到该组件');
          }
        } else {
          (_c = rootNodeWrapper) === null || _c === void 0 ? void 0 : _c.appendChild(_this.oWrapper1);
        }
      }

      if (!equal(extraProps, _this.extraProps)) {
        _this.extraProps = __assign({}, extraProps);
        _this.parcel && _this.parcel.update(extraProps);
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

      if ((_a = _this.rootNodeWrapper.current) === null || _a === void 0 ? void 0 : _a.contains(_this.oWrapper1)) {
        _this.rootNodeWrapper.current.removeChild(_this.oWrapper1);
      } else {
        console.warn('无法卸载该组件, 发生错误的原因可能是没有加载到该组件');
      }

      _this.parcel && _this.parcel.unmount();
      _this.parcel = null;
      var allUnmount = toolFunction(_this.runId, -1);

      if (allUnmount) {
        selectorMap.getElementById(false);
        selectorMap.querySelector(false);
        selectorMap.querySelectorAll(false);
        HTMLHeadElement.prototype.appendChild = originAppendChild;
      }

      _this.oWrapper1 = null;
      _this.oWrapper2 = null;
      _this.rootNodeWrapper = null;
      _this.styleElements = [];
    };

    _this.getDom = function () {
      return '-';
    };

    _this.registerComponentAndMount = function (component) {
      var lifecycles = _this.registerComponent(_this.oWrapper2, component, _this.currentName);

      _this.parcel = mountRootParcel(lifecycles, __assign({
        domElement: _this.getDom()
      }, _this.extraProps));
    };

    _this.addComponentToPage = function (rootEleWrapper, isLocal) {
      var _a, _b;
      /** 如果visible是false就暂时先把display置为none 之后再remove */


      if (!_this.visible) _this.oWrapper1.style.display = 'none';
      var supportShadowDOM = !!_this.oWrapper1.attachShadow && !isLocal;
      var root = supportShadowDOM ? _this.oWrapper1.attachShadow({
        mode: 'open'
      }) && _this.oWrapper1.shadowRoot : _this.oWrapper1;
      var cssurl = _this.currentCSSUrl;

      if (cssurl) {
        var oLink = document.createElement('link');
        oLink.rel = "stylesheet";
        oLink.href = cssurl;
        isLocal ? document.head.appendChild(oLink) : (_a = root) === null || _a === void 0 ? void 0 : _a.appendChild(oLink);
      }

      _this.styleElements.forEach(function (style) {
        var _a;

        (_a = root) === null || _a === void 0 ? void 0 : _a.appendChild(style);
      });

      (_b = root) === null || _b === void 0 ? void 0 : _b.appendChild(_this.oWrapper2);
      rootEleWrapper.appendChild(_this.oWrapper1);
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


        if (!_this.visible) {
          _this.oWrapper1 = (_a = rootEleWrapper) === null || _a === void 0 ? void 0 : _a.removeChild(_this.oWrapper1);
        }

        _this.oWrapper1.style.display = 'block';
      });
    };

    _this.getOriginCode = function (url, method, data) {
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

    _this.getOriginComponent = function () {
      if (_this.loadType === 'script') {
        return new Promise(function (res) {
          var oScript = document.createElement('script');
          oScript.type = 'text/javascript';
          oScript.src = _this.currentUrl;
          oScript.setAttribute('data-id', _this.currentName);
          document.body.appendChild(oScript);
          var runId = _this.runId = toolFunction(_this.oWrapper1);
          window.module = {};

          window.require = function (str) {
            if (!str) return;
            if (str === 'vue' || str === 'react') return _this.framework;
            var external = (_this.instable_externals || {})[str];
            if (!external) throw Error("\u7EC4\u4EF6\u53EF\u80FD\u9700\u8981 " + str + " \u4F5C\u4E3Aexternal");
            return external;
          };

          window.exports = null;

          oScript.onload = function () {
            var exports = window.module.exports;

            if (exports.__esModule) {
              _this.component = exports.default;
            } else {
              _this.component = exports;
            }

            toolFunction(runId, false);

            if (!toolFunction()) {
              window.module = originModule;
              window.require = originRequire;
              window.exports = originExports;
            }

            oScript.remove();
            res(_this.component);
          };
        });
      } else {
        console.warn('暂时关闭xhr的加载方式, 将使用script方式加载');
        _this.loadType = 'script';
        return new Promise(function (res) {
          return res(_this.getOriginComponent());
        }); // return new Promise(res => {
        //   this.getOriginCode(this.currentUrl).then(data => {
        //     /** 通过XMLHttpRequest获取源代码 */
        //     if (!data || typeof data !== 'string') throw Error('没有加载到远程vue组件');
        //     const internalSelf = this.executeOriginCode(data);
        //     if (!this.currentName) (this.currentName = this.getCurrentName(internalSelf));
        //     if (!this.currentName) throw Error('没有获取到vue组件');
        //     this.oWrapper2.id = this.currentName;
        //     this.component = internalSelf[this.currentName];
        //     res(this.component);
        //   }).catch(err => {
        //     /** 如果进入到这里说明可能请求出错了 */
        //     console.warn('远程vue组件请求可能出现跨域或其他网络问题');
        //     /** 如果出现跨域问题就强制使用script方式加载一遍 */
        //     this.loadType = 'script';
        //     res(this.getOriginVueComponent());
        //   });
        // });
      }
    };

    _this.render = function () {
      return React.createElement("div", {
        style: {
          height: '100%'
        },
        id: _this.props.id || '',
        ref: _this.rootNodeWrapper
      });
    };

    initAppendChildHack();
    initSelectorHack();
    var loadType = props.loadType,
        url = props.jsurl,
        cssurl = props.cssurl,
        component = props.component,
        name = props.name,
        visible = props.visible,
        extraProps = props.extraProps;
    var unique = uniqueId();
    _this.loadType = loadType || 'script'; // 初始化时候是否显示

    _this.visible = typeof visible === 'boolean' ? visible : true; // 判断是否是本地组件

    _this.isLocal = !!component; // 获取额外的属性

    _this.extraProps = extraProps || {}; // 获取外部传进来的css的url 可能没有

    _this.currentCSSUrl = cssurl || ''; // 这个属性是用来标识要替换远程源代码中的publicPath的关键字

    _this.publicPathKey = props.instable_publicPath || '__WILL_BE_REPLACED_PUBLIC_PATH__'; // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉

    _this.publicPathReg = new RegExp(_this.publicPathKey, 'g'); // 生成每个iframe的唯一表示

    _this.currentName = name || (url ? url.replace(httpReg, '') + "." + unique : "root-" + unique); // vue会挂载到这个节点2上

    _this.oWrapper2.id = _this.currentName; // 把wrapper暂时存到外头

    getWrapper(_this.currentName, _this.oWrapper1);
    _this.oWrapper1.style.height = '100%';
    _this.oWrapper2.style.height = '100%'; // 暂时可能用不到的

    _this.instable_externals = _this.props.instable_externals || {};
    return _this;
  }

  return VueIframe;
}(React.PureComponent);

var __VUE_INTERNAL_INIT__ = Vue.prototype._init;

Vue.prototype._init = function (options) {
  /**
   * TODO: 留个口儿 用来以后支持加载整个Vue应用
   */
  __VUE_INTERNAL_INIT__.call(this, options);
};

var httpReg$1 = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

var VueIframe$1 =
/** @class */
function (_super) {
  __extends(VueIframe, _super);

  function VueIframe(props) {
    var _this = _super.call(this, props) || this;

    _this.registerComponent = function (el, vueComponent, id) {
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
              attrs: __assign({}, _this.extraProps)
            })]);
          }
        }
      });
      return {
        bootstrap: vueInstance.bootstrap,
        mount: vueInstance.mount,
        unmount: vueInstance.unmount,
        update: vueInstance.update
      };
    };

    _this.isComponent = function (component) {
      return component && _typeof(component) === 'object' && typeof component.render === 'function';
    };

    _this.executeOriginCode = function (code) {
      var internalSelf = {
        Vue: Vue
      };
      var reg = _this.publicPathReg;
      var publicPath = _this.currentPublicPath;
      var url = _this.currentUrl;

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

    var jsurl = props.jsurl,
        component = props.component;
    _this.framework = Vue; // 获取到外部传进来的vue组件

    _this.component = component; // 获取到外部传来的url

    _this.currentUrl = jsurl || ''; // 获取传进来的url的协议+域名+端口

    _this.currentPublicPath = (httpReg$1.exec(_this.currentUrl) || [''])[0] + "/";
    return _this;
  }

  return VueIframe;
}(VueIframe);

var httpReg$2 = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

var ReactIframe =
/** @class */
function (_super) {
  __extends(ReactIframe, _super);

  function ReactIframe(props) {
    var _this = _super.call(this, props) || this;

    _this.getDom = function () {
      return _this.oWrapper2;
    };

    _this.registerComponent = function (el, reactComponent, id) {
      var reactInstance = singleSpaReact({
        React: React,
        ReactDOM: ReactDOM,
        rootComponent: reactComponent
      });
      return {
        bootstrap: reactInstance.bootstrap,
        mount: reactInstance.mount,
        unmount: reactInstance.unmount,
        update: reactInstance.update
      };
    };

    _this.isComponent = function (component) {
      return component && typeof component === 'function' || _typeof(component) === 'object' && component.$$typeof;
    };

    _this.executeOriginCode = function (code) {};

    var jsurl = props.jsurl,
        component = props.component;
    _this.framework = React; // 获取到外部传进来的vue组件

    _this.component = component; // 获取到外部传来的url

    _this.currentUrl = jsurl || ''; // 获取传进来的url的协议+域名+端口

    _this.currentPublicPath = (httpReg$2.exec(_this.currentUrl) || [''])[0] + "/";
    return _this;
  }

  return ReactIframe;
}(VueIframe);

export default VueIframe$1;
export { ReactIframe as ReactFrame, VueIframe$1 as VueFrame };
//# sourceMappingURL=index.js.map
