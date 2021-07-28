import React, { RefObject } from 'react';
import Vue from 'vue';
import { mountRootParcel, ParcelConfig } from 'single-spa';
import singleSpaVue from 'single-spa-vue';

window.onerror = (err) => { console.log('chucuole ', err) ; return true}

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

  constructor(props: IProps) {
    super(props);
    const { loadType, jsurl, cssurl, component, name, visible, instable_publicPath } = props;
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
    this.currentName = name || '';
    // 获取传进来的url的协议+域名+端口
    this.currentPublicPath = `${(
      new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i').exec(this.currentUrl) || ['']
    )[0]}/`;
    // vue会挂载到这个节点2上
    this.vueWrapper2.id = this.currentName;
    // 初始化一些hack
    this.initHack();
  }

  componentDidMount = async () => {
    if (!this.currentUrl && !this.component) throw Error('组件必须接收一个url或者component属性');
    const rootEleWrapper = this.rootNodeWrapper.current;
    if (!rootEleWrapper) throw Error('没有vue组件的root节点');
    /** 如果外部传了component就随机起个name */
    (this.props.component && (this.currentName = String(+ new Date())));
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
    (this.internalHackSelector as Function)('getElementById', false);
    (this.internalHackSelector as Function)('querySelector', false);
    (this.internalHackSelector as Function)('querySelectorAll', false);
    (this.vueWrapper1 as any) = null;
    (this.vueWrapper2 as any) = null;
    (this.rootNodeWrapper as any) = null;
    (this.styleElements as any) = [];
  }

  private initHack = () => {
    const originAppendChild = HTMLHeadElement.prototype.appendChild;
    const s = HTMLDocument.prototype;
    const selectorMap = {
      'getElementById': this.initHackSelector('getElementById', s['getElementById']),
      'querySelector': this.initHackSelector('querySelector', s['querySelector']),
      'querySelectorAll': this.initHackSelector('querySelectorAll', s['querySelectorAll']),
    };
    /**
     * 被bind过的函数的ts类型不会写...... 要死......
     */
    (this.internalHackCSSsandbox as Function) =
      this.internalHackCSSsandbox.bind(this, originAppendChild);
    (this.internalHackSelector as Function) =
      this.internalHackSelector.bind(this, selectorMap);
  }

  /**
   * 快被 typescript 搞死了......
   * 有没有大佬能教教我这块儿应该怎么写ts
   */
  private initHackSelector = (
    name: keyof ISelecotr,
    originSelectorFn: ((id: string) => HTMLElement | null) |
      (<E extends Element = Element>(id: string) => NodeListOf<E>) |
      HTMLCollectionOf<Element>,
  ) => {
    return (codeIsExecuting: boolean) => {
      const HTMLDocumentPrototype = (HTMLDocument.prototype as any);
      if (!codeIsExecuting) HTMLDocumentPrototype[name] = originSelectorFn;
      const _this = this;
      HTMLDocumentPrototype[name] = function <E extends Element = Element>(id: string):
        HTMLElement | null | NodeListOf<E> {
        const originEl = (originSelectorFn as any).call(this, id);
        const shadowEl = _this.vueWrapper1 &&
          _this.vueWrapper1.shadowRoot &&
          _this.vueWrapper1.shadowRoot[name] &&
          typeof _this.vueWrapper1.shadowRoot[name] === 'function' &&
          (_this.vueWrapper1.shadowRoot as any)[name](id) as HTMLElement | null | NodeListOf<E>;
        return originEl || (shadowEl || null);
      }
    }
  }

  private internalHackSelector = (
    selectorMap: { [name: string]: Function },
    name: keyof ISelecotr,
    codeIsExecuting: boolean,
  ) => {
    selectorMap[name](codeIsExecuting);
  }

  private internalHackCSSsandbox = (
    originAppendChild: <T extends Node>(this: any, newChild: T) => T,
    codeIsExecuting: boolean,
  ) => {
    /**
     * css 沙箱基于shadow dom
     * 如果浏览器版本不支持shadow dom的话
     * 可以通过静态检测vue组件render方法的字符串
     * 动态给每个节点的attrs上注入一个自定义特殊属性的方式
     * 然后再给每个style文件的innerText的每个选择器加上属性选择
     * TODO: 比较麻烦 以后再支持吧
     */
    if (!this.rootNodeWrapper.current?.attachShadow) return;
    if (!codeIsExecuting) HTMLHeadElement.prototype.appendChild = originAppendChild;
    const LINK_TAG_NAME = 'LINK';
    const STYLE_TAG_NAME = 'STYLE';
    const _this = this;
    HTMLHeadElement.prototype.appendChild = function <T extends Node>(this: any, newChild: T) {
      const element = newChild as any;
      if (element.tagName) {
        switch (element.tagName) {
          case LINK_TAG_NAME:
          case STYLE_TAG_NAME: {
            _this.styleElements.push(element);
            return originAppendChild.call(this, element.cloneNode()) as T;
          }
        }
      }
      return originAppendChild.call(this, element) as T;
    };
  }

  registerComponentAndMount = (component: object): void => {
    const lifecycles = this.registerVueComponent(this.vueWrapper2, component, this.currentName);
    this.parcel = mountRootParcel((lifecycles as ParcelConfig), { domElement: '-' });
  }

  addComponentToPage = (rootEleWrapper: HTMLDivElement): void => {
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

  private getCurrentName = (self: any): string => {
    for (const props in self) {
      if (!self.hasOwnProperty(props)) break;
      if (props !== 'Vue') return props;
    }
    return '';
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
        /**
         * script标签没有defer或async的时候
         * 下载数据以及执行都是同步的
         */
        (this.internalHackCSSsandbox as Function)(true);
        (this.internalHackSelector as Function)('getElementById', true);
        (this.internalHackSelector as Function)('querySelector', true);
        (this.internalHackSelector as Function)('querySelectorAll', true);
        const type = 'text/javascript';
        const oScript1 = document.createElement('script');
        oScript1.type = type;
        const originSelf = window.self;
        oScript1.innerText = 'window.self = {Vue: null}';
        document.body.appendChild(oScript1);
        window.self.Vue = Vue;
        const oScript2 = document.createElement('script');
        oScript2.type = type;
        oScript2.src = this.currentUrl;
        document.body.appendChild(oScript2);
        oScript2.onload = () => {
          (this.internalHackCSSsandbox as Function)(false);
          const currentSelf: any = window.self;
          (window as any).self = originSelf;
          if (!this.currentName) (this.currentName = this.getCurrentName(currentSelf));
          if (!this.currentName) throw Error('没有获取到vue组件');
          this.vueWrapper2.id = this.currentName;
          this.component = currentSelf[this.currentName];
          oScript1.parentNode?.removeChild(oScript1);
          oScript2.parentNode?.removeChild(oScript2);
          res(this.component);
        };
      });
    } else {
      return new Promise(res => {
        this.getOriginCode(this.currentUrl).then(data => {
          /**
           * 通过XMLHttpRequest获取源代码
           */
          if (!data || typeof data !== 'string') throw Error('没有加载到远程vue组件');
          (this.internalHackCSSsandbox as Function)(true);
          (this.internalHackSelector as Function)('getElementById', true);
          (this.internalHackSelector as Function)('querySelector', true);
          (this.internalHackSelector as Function)('querySelectorAll', true);
          const internalSelf = this.executeOriginCode(data);
          (this.internalHackCSSsandbox as Function)(false);
          if (!this.currentName) (this.currentName = this.getCurrentName(internalSelf));
          if (!this.currentName) throw Error('没有获取到vue组件');
          this.vueWrapper2.id = this.currentName;
          this.component = internalSelf[this.currentName];
          res(this.component);
        }).catch(err => {
          /**
           * 如果进入到这里说明可能请求出错了
           */
          console.warn('远程vue组件请求可能出现跨域或其他网络问题');
          /**
           * 如果出现跨域问题就强制使用script方式加载一遍
           */
          this.loadType = 'script';
          res(this.getOriginVueComponent());
        })
      })
    } 
  }

  render = () => (<div id={this.props.id || ''} ref={this.rootNodeWrapper} />)
}
