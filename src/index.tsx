import React, { RefObject } from 'react';
import Vue from 'vue';
import { mountRootParcel, ParcelConfig } from 'single-spa';
import singleSpaVue from 'single-spa-vue';
import uniqueId from 'lodash/uniqueId';

const __VUE_INTERNAL_INIT__ = Vue.prototype._init;
Vue.prototype._init = function(options: any) {
  /**
   * TODO: 留个口儿 用来以后支持加载整个Vue应用
   */
  __VUE_INTERNAL_INIT__.call(this, options);
};

interface Self {
  Vue: typeof Vue;
  [ propName: string ]: any;
}

interface IProps0 {
  cssurl?: string;
  name?: string;
  id?: string;
  visible?: boolean;
  extraProps?: { [propName: string]: any };
  loadType?: 'xhr' | 'script';
  instable_publicPath?: string;
}

interface IProps1 extends IProps0 {
  jsurl: string;
  component?: object;
}

interface IProps2 extends IProps0 {
  component: object;
  jsurl?: string; 
}

type IProps = IProps1 | IProps2;
type RefType = RefObject<HTMLDivElement>;


interface ISelecotr {
  'getElementById': NonElementParentNode;
  'querySelector': ParentNode;
  'querySelectorAll': ParentNode;
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
const toolFunction = ((
  obj: { [prop: string]: { running: boolean; ele: HTMLDivElement } },
  id: number,
) => {
  return function(a?: number | HTMLDivElement, b?: HTMLDivElement | false | -1):
    boolean |
    HTMLDivElement |
    HTMLDivElement[] |
    number 
  {
    const length = arguments.length;
    if (!length) {
      if (!Object.keys(obj).length) return false;
      return Object.values(obj).some(item => item.running);
    } else if (length === 1 && a === -1) {
      return Object.values(obj).map(item => item.ele);
    } else if (length === 1 && a instanceof HTMLElement) {
      obj[id++] = { running: true, ele: a };
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
  }
})({}, 0);

const getWrapper = ((obj: { [ name: string ]: HTMLDivElement }) => {
  return (name: string, ele?: HTMLDivElement) => {
    if (name && ele) (obj[name] = ele)
    else if (name && !ele) return obj[name];
  }
})({});

const originSelectors = HTMLDocument.prototype as any;
const initHackSelector = (
  name: keyof ISelecotr,
  originSelectorFn:
    Document['getElementById'] |
    ParentNode['querySelector'] |
    ParentNode['querySelectorAll']
) => {
  return (cancelHack?: boolean) => {
    const HTMLDocumentPrototype = (HTMLDocument.prototype as any);
    if (cancelHack) return (HTMLDocumentPrototype[name] = originSelectorFn);
    HTMLDocumentPrototype[name] = function <E extends Element = Element>(id: string):
      HTMLElement | null | NodeListOf<E> {
      const originEl = (originSelectorFn as Function).call(this, id);
      if (originEl) return originEl;
      if (!originEl) {
        const allShadowRoot = toolFunction(-1) as HTMLDivElement[];
        const len = allShadowRoot.length;
        for (let i = 0; i < len; i++) {
          const wrapper = allShadowRoot[i];
          const shadowEl = wrapper &&
            wrapper.shadowRoot &&
            wrapper.shadowRoot[name] &&
            typeof wrapper.shadowRoot[name] === 'function' &&
            (wrapper.shadowRoot as any)[name](id) as HTMLElement | null | NodeListOf<E>;
          if (shadowEl) return shadowEl;
        }
      }
      return null;
    }
  };
}

const originModule = window.module;
const originRequire = window.require;
const originExports = window.exports;
const selectorMap = {
  'getElementById': initHackSelector('getElementById', originSelectors['getElementById']),
  'querySelector': initHackSelector('querySelector', originSelectors['querySelector']),
  'querySelectorAll': initHackSelector('querySelectorAll', originSelectors['querySelectorAll']),
};
selectorMap.getElementById();
selectorMap.querySelector();
selectorMap.querySelectorAll();

const originAppendChild = HTMLHeadElement.prototype.appendChild;
const LINK_TAG_NAME = 'LINK';
const STYLE_TAG_NAME = 'STYLE';

HTMLHeadElement.prototype.appendChild = function <T extends Node>(this: any, newChild: T) {
  const element = newChild as any;
  if (element.tagName) {
    switch (element.tagName) {
      case LINK_TAG_NAME:
      case STYLE_TAG_NAME: {
        const currentScript = document.currentScript;
        /** 获取到currentName */
        const currentName = currentScript?.getAttribute('data-id');
        if (!currentName) return originAppendChild.call(this, element) as T;
        setTimeout(() => {
          getWrapper(currentName)?.shadowRoot?.appendChild(element);
        })
        return originAppendChild.call(this, element.cloneNode()) as T;
      }
    }
  }
  return originAppendChild.call(this, element) as T;
};

const httpReg = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

export default class VueIframe extends React.PureComponent<IProps, {}> {
  private loadType: IProps['loadType']; // 加载方式 支持ajax和script标签
  private currentName: string; // 每个iframe的name
  private visible: boolean; // 是否显示
  private currentUrl: string; // 传进来的url
  private currentCSSUrl: string; // 传进来的cssurl
  private currentPublicPath: string; // 传进来的url的协议+域名+端口
  private publicPathKey: string; // 远程源代码中要被替换的关键字
  private publicPathReg: RegExp; // 用来替换源代码中关键字的正则
  private rootNodeWrapper: RefType = React.createRef<HTMLDivElement>(); // vue挂载节点是根据el再往上找它的爹
  private component: any; // vue 组件实例
  private parcel: any; // parcel实例
  private vueWrapper1: HTMLDivElement = document.createElement('div'); // 挂载vue以及隐藏vue需要两个节点
  private vueWrapper2: HTMLDivElement = document.createElement('div'); // 真正vue需要挂载的节点
  private styleElements: HTMLLinkElement[] | HTMLStyleElement[] = []; // 用来临时存放要被添加的style标签
  private runId: number = -1; // 当前正在跑的vue组件的runId 唯一

  constructor(props: IProps) {
    super(props);
    const { loadType, jsurl = '', cssurl, component, name, visible, instable_publicPath } = props;
    const unique = uniqueId();
    this.loadType = loadType || 'script';
    // 初始化时候是否显示
    this.visible = typeof visible === 'boolean' ? visible : true;
    // 获取到外部传进来的vue组件
    this.component = component;
    // 获取到外部传来的url
    this.currentUrl = jsurl || '';
    // 获取外部传进来的css的url 可能没有
    this.currentCSSUrl = cssurl || '';
    // 这个属性是用来标识要替换远程源代码中的publicPath的关键字
    this.publicPathKey = instable_publicPath || '__WILL_BE_REPLACED_PUBLIC_PATH__';
    // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉
    this.publicPathReg = new RegExp(this.publicPathKey, 'g');
    // 生成每个iframe的唯一表示
    this.currentName = name || `${jsurl.replace(httpReg, '')}.${unique}`|| `vue-root-${unique}`;
    // 获取传进来的url的协议+域名+端口
    this.currentPublicPath = `${(httpReg.exec(this.currentUrl) || [''])[0]}/`;
    // vue会挂载到这个节点2上
    this.vueWrapper2.id = this.currentName;
    // 把wrapper暂时存到外头
    getWrapper(this.currentName, this.vueWrapper1);
  }

  componentDidMount = async () => {
    if (!this.currentUrl && !this.component) throw Error('组件必须接收一个url或者component属性');
    const rootEleWrapper = this.rootNodeWrapper.current;
    if (!rootEleWrapper) throw Error('没有vue组件的root节点');
    /** 如果外部传了component就随机起个name */
    const component = this.props.component || await this.getOriginVueComponent();
    if (!this.isVueComponent(component)) return;
    this.registerComponentAndMount(component);
    this.addComponentToPage(rootEleWrapper);
  }

  componentDidUpdate = () => {
    const { visible = true } = this.props; 
    if (visible === this.visible) return;
    this.visible = visible;
    const rootNodeWrapper = this.rootNodeWrapper.current;
    if (!visible) {
      this.vueWrapper1 = rootNodeWrapper?.removeChild(this.vueWrapper1) as HTMLDivElement;
    } else {
      rootNodeWrapper?.appendChild(this.vueWrapper1);
    }
  }

  /**
   * componentWillUnmount被调用时候不一定就是出错
   * 但是贸然地在react项目中挂载vue组件可能出现问题
   * 当出现问题的时候react组件会被卸载 此时会调用componentWillUnmount
   * 这个时候应该确认下项目是否还正常运行(八成报错)
   */
  componentWillUnmount = () => {
    (this.rootNodeWrapper.current as any).removeChild(this.vueWrapper1);
    this.parcel.unmount();
    this.parcel = null;
    const allUnmount = toolFunction(this.runId, -1);
    if (allUnmount) {
      selectorMap.getElementById(false);
      selectorMap.querySelector(false);
      selectorMap.querySelectorAll(false);
      HTMLHeadElement.prototype.appendChild = originAppendChild;
    }
    (this.vueWrapper1 as any) = null;
    (this.vueWrapper2 as any) = null;
    (this.rootNodeWrapper as any) = null;
    (this.styleElements as any) = [];
  }

  private registerComponentAndMount = (component: object): void => {
    const lifecycles = this.registerVueComponent(this.vueWrapper2, component, this.currentName);
    this.parcel = mountRootParcel((lifecycles as ParcelConfig), { domElement: '-' });
  }

  private addComponentToPage = (rootEleWrapper: HTMLDivElement): void => {
    /** 如果visible是false就暂时先把display置为none 之后再remove */
    if (!this.visible) this.vueWrapper1.style.display = 'none';
    const supportShadowDOM = !!this.vueWrapper1.attachShadow;
    const root = supportShadowDOM ? (
      (this.vueWrapper1.attachShadow({ mode: 'open' })) &&
      this.vueWrapper1.shadowRoot
    ) : this.vueWrapper1;
    const cssurl = this.currentCSSUrl;
    if (cssurl) {
      const oLink = document.createElement('link');
      oLink.rel = "stylesheet";
      oLink.href = cssurl;
      root?.appendChild(oLink);
    }

    this.styleElements.forEach(style => {
      root?.appendChild(style);
    });
    root?.appendChild(this.vueWrapper2);
    rootEleWrapper.appendChild(this.vueWrapper1);
    setTimeout(() => {
      /**
       * 对于一上来visible就是不可见的组件
       * 先把display置为none 然后再添加进页面
       * 这是为了防止vue组件中可能会有类似echarts
       * 之类的工具会通过document.querySelector等
       * 方法选择dom
       * 如果直接就不把vue组件添加进页面的话
       * vue组件内部那些选择dom的方法可能会产生问题
       */
      if (!this.visible) {
        this.vueWrapper1 = rootEleWrapper?.removeChild(this.vueWrapper1) as HTMLDivElement;
      }
      this.vueWrapper1.style.display = 'block';
    });
  }

  private registerVueComponent = (el: string | HTMLElement, vueComponent: object, id: string) => {
    const vueInstance = singleSpaVue({
      Vue,
      appOptions: {
        el: typeof el === 'string' ? `#${el}` : el,
        render: (h: any) => h('div', { attrs: { id } }, [h(vueComponent, {
          props: { ...this.props.extraProps },
        })]),
      },
    });
    return ({
      bootstrap: vueInstance.bootstrap,
      mount: vueInstance.mount,
      unmount: vueInstance.unmount,
    })
  }

  private isVueComponent = (component: any): boolean => {
    return component && typeof component === 'object' && typeof component.render === 'function';
  }

  private getOriginCode = (url: string, method: string = 'GET', data?: any): Promise<any> => {
    return new Promise((res, rej) => {
      const xhr: XMLHttpRequest = XMLHttpRequest ? new XMLHttpRequest() :
        ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : null;
      if (method === 'GET' && data) data && (url += `?${data}`);
      xhr.open(method, url, true);
      if (method == 'GET') {
        xhr.send();
      } else {
        xhr.setRequestHeader('content-type', 'text/plain');
        xhr.send((data as (Document | BodyInit | null)));
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) res(xhr.responseText);
          else rej(xhr);
        }      
      }
    });
  }

  private executeOriginCode = (code: string): Self => {
    const internalSelf: Self = { Vue };
    const reg = this.publicPathReg;
    const publicPath = this.currentPublicPath;
    const url = this.currentUrl;
    if (reg.test(code)) {
      /**
       * 自己开发组件的时候使用可以配置publicPath
       * 为了让react-vue-mirco-frame支持加载静态资源
       * 可以给publicPath设置为一个约定好的值
       * 然后这里用传进来的origin替换掉这个约定好的值
       * 这个约定好的值默认是 __WILL_BE_REPLACED_PUBLIC_PATH__
       */
      const codeStr = code.replace(reg, publicPath);
      const originCodeFn = new Function("self", codeStr);
      originCodeFn(internalSelf);
    } else {
      /**
       * 如果没有配置这个值的话 就以hack的方式注入origin
       * webpack打包出来的umd代码里面会动态监测document.currentScript
       * 通过临时给这个currentScript换掉的方式让webpack将origin注入进代码
       */
      const temporaryDocument = (window.document as any);
      const originCurrentScript = window.document.currentScript;
      const temporaryScript = document.createElement('script');
      const defineProperty = Object.defineProperty;
      temporaryScript.src = url;
      defineProperty(temporaryDocument, 'currentScript', {
        value: temporaryScript,
        writable: true,
      });
      const originCodeFn = new Function("self", code);
      originCodeFn(internalSelf);
      defineProperty(temporaryDocument, 'currentScript', {
        value: originCurrentScript,
        writable: false,
      });
      temporaryScript.remove && temporaryScript.remove();
    };
    return internalSelf;
  } 

  private getOriginVueComponent = (): object => {
    if (this.loadType === 'script') {
      return new Promise(res => {
        const oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = this.currentUrl;
        oScript.setAttribute('data-id', this.currentName);
        document.body.appendChild(oScript);
        const runId = this.runId = toolFunction(this.vueWrapper1) as number;
        (window as any).module = {};
        (window as any).require = (str: string) => (str === 'vue') && Vue;
        window.exports = null;
        oScript.onload = () => {
          this.component = window.module.exports;
          toolFunction(runId, false);
          if (!toolFunction()) {
            window.module = originModule;
            window.require = originRequire;
            window.exports = originExports;
          }
          /**
           * 这里留个口可以用来以后支持esm规范的组件
           * const temporaryExports = window.exports;
           * let component = null;
           * for (const propName in temporaryExports) {
           * if (!temporaryExports.hasOwnProperty(propName)) continue;
           *   component = temporaryExports[propName]
           *   delete temporaryExports[propName];
           * }
           */
          oScript.remove();
          res(this.component);
        };
      });
    } else {
      console.warn('暂时关闭xhr的加载方式, 将使用script方式加载')
      this.loadType = 'script';
      return new Promise(res => res(this.getOriginVueComponent()));
      // return new Promise(res => {
      //   this.getOriginCode(this.currentUrl).then(data => {
      //     /** 通过XMLHttpRequest获取源代码 */
      //     if (!data || typeof data !== 'string') throw Error('没有加载到远程vue组件');
      //     const internalSelf = this.executeOriginCode(data);
      //     if (!this.currentName) (this.currentName = this.getCurrentName(internalSelf));
      //     if (!this.currentName) throw Error('没有获取到vue组件');
      //     this.vueWrapper2.id = this.currentName;
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
  }

  render = () => (<div id={this.props.id || ''} ref={this.rootNodeWrapper} />)
}
