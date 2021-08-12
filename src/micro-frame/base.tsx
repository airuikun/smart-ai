import React, { RefObject } from 'react';
import { mountRootParcel, ParcelConfig } from 'single-spa';
import uniqueId from 'lodash/uniqueId';
import equal from 'lodash/eq';

interface IProps0 {
  cssurl?: string;
  name?: string;
  id?: string;
  visible?: boolean;
  extraProps?: { [propName: string]: any };
  loadType?: 'xhr' | 'script';
  instable_publicPath?: string;
  instable_externals?: { [prop: string]: any };
}

interface IProps1 extends IProps0 {
  jsurl: string;
  component?: object;
}

interface IProps2 extends IProps0 {
  component: object;
  jsurl?: string; 
}

export type IProps = IProps1 | IProps2;
type RefType = RefObject<HTMLDivElement>;


interface ISelecotr {
  'getElementById': NonElementParentNode;
  'querySelector': ParentNode;
  'querySelectorAll': ParentNode;
}

type LifecyclesProp = (singleSpaProps: object) => Promise<any>;

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
const originAppendChild = HTMLHeadElement.prototype.appendChild;
const originModule = window.module;
const originRequire = window.require;
const originExports = window.exports;
const LINK_TAG_NAME = 'LINK';
const STYLE_TAG_NAME = 'STYLE';

const hackSelector = (
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

const selectorMap = {
  'getElementById': hackSelector('getElementById', originSelectors['getElementById']),
  'querySelector': hackSelector('querySelector', originSelectors['querySelector']),
  'querySelectorAll': hackSelector('querySelectorAll', originSelectors['querySelectorAll']),
};

const initSelectorHack = () => {
  selectorMap.getElementById();
  selectorMap.querySelector();
  selectorMap.querySelectorAll(); 
}

const initAppendChildHack = () => {
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
          });
        }
      }
    }
    return originAppendChild.call(this, element) as T;
  };
}

const httpReg = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

export default abstract class VueIframe extends React.PureComponent<IProps, {}> {
  abstract framework: any; // 组件的框架
  abstract currentUrl: string; // 传进来的url
  abstract component: any; // vue 组件实例
  abstract currentPublicPath: string; // 传进来的url的协议+域名+端口
  protected loadType: IProps['loadType']; // 加载方式 支持ajax和script标签
  protected currentName: string; // 每个iframe的name
  protected visible: boolean; // 是否显示
  protected currentCSSUrl: string; // 传进来的cssurl
  protected publicPathKey: string; // 远程源代码中要被替换的关键字
  protected publicPathReg: RegExp; // 用来替换源代码中关键字的正则
  protected rootNodeWrapper: RefType = React.createRef<HTMLDivElement>(); // vue挂载节点是根据el再往上找它的爹
  protected parcel: any; // parcel实例
  protected oWrapper1: HTMLDivElement = document.createElement('div'); // 挂载vue以及隐藏vue需要两个节点
  protected oWrapper2: HTMLDivElement = document.createElement('div'); // 真正vue需要挂载的节点
  protected styleElements: HTMLLinkElement[] | HTMLStyleElement[] = []; // 用来临时存放要被添加的style标签
  protected runId: number = -1; // 当前正在跑的vue组件的runId 唯一
  protected isLocal: boolean; // 是否是本地组件
  protected extraProps: any; // 额外的属性
  private instable_externals: IProps0['instable_externals']; // 可能用不到

  constructor(props: IProps) {
    super(props);
    initAppendChildHack();
    initSelectorHack();
    const { loadType, jsurl: url, cssurl, component, name, visible, extraProps } = props;
    const unique = uniqueId();
    this.loadType = loadType || 'script';
    // 初始化时候是否显示
    this.visible = typeof visible === 'boolean' ? visible : true;
    // 判断是否是本地组件
    this.isLocal = !!component;
    // 获取额外的属性
    this.extraProps = extraProps || {};
    // 获取外部传进来的css的url 可能没有
    this.currentCSSUrl = cssurl || '';
    // 这个属性是用来标识要替换远程源代码中的publicPath的关键字
    this.publicPathKey = props.instable_publicPath || '__WILL_BE_REPLACED_PUBLIC_PATH__';
    // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉
    this.publicPathReg = new RegExp(this.publicPathKey, 'g');
    // 生成每个iframe的唯一表示
    this.currentName = name || (url ? `${url.replace(httpReg, '')}.${unique}` : `root-${unique}`);
    // vue会挂载到这个节点2上
    this.oWrapper2.id = this.currentName;
    // 把wrapper暂时存到外头
    getWrapper(this.currentName, this.oWrapper1);
    this.oWrapper1.style.height = '100%';
    this.oWrapper2.style.height = '100%';
    // 暂时可能用不到的
    this.instable_externals = this.props.instable_externals || {};
  }

  componentDidMount = async () => {
    if (!this.currentUrl && !this.component) throw Error('组件必须接收一个url或者component属性');
    const rootEleWrapper = this.rootNodeWrapper.current;
    if (!rootEleWrapper) throw Error('没有组件的root节点');
    /** 如果外部传了component就随机起个name */
    const component = this.isLocal ? this.component : await this.getOriginComponent();
    (window as any)._test = component
    if (!this.isComponent(component)) return;
    this.registerComponentAndMount(component);
    this.addComponentToPage(rootEleWrapper, this.isLocal);
  }

  componentDidUpdate = () => {
    const { visible = true, extraProps } = this.props; 
    if (!(visible === this.visible)) {
      this.visible = visible;
      const rootNodeWrapper = this.rootNodeWrapper.current;
      if (!visible) {
        if (rootNodeWrapper?.contains(this.oWrapper1)) {
          this.oWrapper1 = rootNodeWrapper?.removeChild(this.oWrapper1) as HTMLDivElement;
        } else {
          console.warn('无法卸载该组件, 发生错误的原因可能是没有加载到该组件');
        }
      } else {
        rootNodeWrapper?.appendChild(this.oWrapper1);
      }
    }
    if (!equal(extraProps, this.extraProps)) {
      this.extraProps = { ...extraProps };
      this.parcel && this.parcel.update(extraProps);
    }
  }

  /**
   * componentWillUnmount被调用时候不一定就是出错
   * 但是贸然地在react项目中挂载vue组件可能出现问题
   * 当出现问题的时候react组件会被卸载 此时会调用componentWillUnmount
   * 这个时候应该确认下项目是否还正常运行(八成报错)
   */
  componentWillUnmount = () => {
    if (this.rootNodeWrapper.current?.contains(this.oWrapper1)) {
      (this.rootNodeWrapper.current as any).removeChild(this.oWrapper1);
    } else {
      console.warn('无法卸载该组件, 发生错误的原因可能是没有加载到该组件');
    }
    this.parcel && this.parcel.unmount();
    this.parcel = null;
    const allUnmount = toolFunction(this.runId, -1);
    if (allUnmount) {
      selectorMap.getElementById(false);
      selectorMap.querySelector(false);
      selectorMap.querySelectorAll(false);
      HTMLHeadElement.prototype.appendChild = originAppendChild;
    }
    (this.oWrapper1 as any) = null;
    (this.oWrapper2 as any) = null;
    (this.rootNodeWrapper as any) = null;
    (this.styleElements as any) = [];
  }

  protected getDom = (): string | HTMLDivElement => '-';

  protected registerComponentAndMount = (component: object): void => {
    const lifecycles = this.registerComponent(this.oWrapper2, component, this.currentName);
    this.parcel = mountRootParcel(
      (lifecycles as ParcelConfig),
      {
        domElement: this.getDom(),
        ...this.extraProps,
      }
    );
  }

  protected addComponentToPage = (rootEleWrapper: HTMLDivElement, isLocal?: boolean): void => {
    /** 如果visible是false就暂时先把display置为none 之后再remove */
    if (!this.visible) this.oWrapper1.style.display = 'none';
    const supportShadowDOM = !!this.oWrapper1.attachShadow && !isLocal;
    const root = supportShadowDOM ? (
      (this.oWrapper1.attachShadow({ mode: 'open' })) &&
      this.oWrapper1.shadowRoot
    ) : this.oWrapper1;
    const cssurl = this.currentCSSUrl;
    if (cssurl) {
      const oLink = document.createElement('link');
      oLink.rel = "stylesheet";
      oLink.href = cssurl;
      isLocal ? document.head.appendChild(oLink) : root?.appendChild(oLink);
    }

    this.styleElements.forEach(style => {
      root?.appendChild(style);
    });
    root?.appendChild(this.oWrapper2);
    rootEleWrapper.appendChild(this.oWrapper1);
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
        this.oWrapper1 = rootEleWrapper?.removeChild(this.oWrapper1) as HTMLDivElement;
      }
      this.oWrapper1.style.display = 'block';
    });
  }

  protected abstract registerComponent(
    el: string | HTMLElement,
    vueComponent: object,
    id: string,
  ): { bootstrap: LifecyclesProp, mount: LifecyclesProp, unmount: LifecyclesProp }

  protected abstract isComponent(component: any): boolean;

  protected getOriginCode = (url: string, method: string = 'GET', data?: any): Promise<any> => {
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

  protected abstract executeOriginCode(code: string): any;

  protected getOriginComponent = (): object => {
    if (this.loadType === 'script') {
      return new Promise(res => {
        const oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = this.currentUrl;
        oScript.setAttribute('data-id', this.currentName);
        document.body.appendChild(oScript);
        const runId = this.runId = toolFunction(this.oWrapper1) as number;
        (window as any).module = {};
        (window as any).require = (str: string) => {
          if (!str) return;
          if (str === 'vue' || str === 'react') return this.framework;
          const external = (this.instable_externals || {})[str];
          if (!external) throw Error(`组件可能需要 ${str} 作为external`);
          return external;
        };
        window.exports = null;
        oScript.onload = () => {
          const exports = window.module.exports;
          if (exports.__esModule) {
            this.component = exports.default;
          } else {
            this.component = exports;
          }
          toolFunction(runId, false);
          if (!toolFunction()) {
            window.module = originModule;
            window.require = originRequire;
            window.exports = originExports;
          }
          oScript.remove();
          res(this.component);
        };
      });
    } else {
      console.warn('暂时关闭xhr的加载方式, 将使用script方式加载')
      this.loadType = 'script';
      return new Promise(res => res(this.getOriginComponent()));
      // return new Promise(res => {
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
  }

  render = () => (<div style={{ height: '100%' }} id={this.props.id || ''} ref={this.rootNodeWrapper} />)
}
