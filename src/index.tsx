import React from 'react';
import Vue from 'vue';
import { mountRootParcel, ParcelConfig } from 'single-spa';
import singleSpaVue from 'single-spa-vue';

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

interface IProps {
  url: string;
  name?: string;
  id?: string;
  visible?: boolean;
  extraProps?: { [propName: string]: any };
  loadType?: 'xhr' | 'script';
  instable_publicPathBeReplacedKey?: string;
}

export default class VueIframe extends React.PureComponent<IProps, any> {
  private loadType: IProps['loadType'];
  private currentName: string; // 每个iframe的唯一标识
  private visible: boolean; // 是否显示
  private currentUrl: string; // 传进来的url
  private currentPublicPath: string; // 传进来的url的协议+域名+端口
  private publicPathKey: string; // 远程源代码中要被替换的关键字
  private publicPathReg: RegExp; // 用来替换源代码中关键字的正则
  private rootNodeWrapper = React.createRef<HTMLDivElement>(); // vue挂载节点是根据el再往上找它的爹
  private component: any; // vue 组件实例
  private parcel: any; // parcel实例
  private vueWrapper1: HTMLDivElement = document.createElement('div'); // 挂载vue以及隐藏vue需要两个节点
  private vueWrapper2: HTMLDivElement = document.createElement('div'); // 真正vue需要挂载的节点

  constructor(props: IProps) {
    super(props);
    const { loadType, url, name, visible, instable_publicPathBeReplacedKey } = props;
    this.loadType = loadType || 'script';
    // 初始化时候是否显示
    this.visible = typeof visible === 'boolean' ? visible : true;
    // 获取到外部传来的url
    this.currentUrl = url;
    // 这个属性是用来标识要替换远程源代码中的publicPath的关键字
    this.publicPathKey = instable_publicPathBeReplacedKey || '__WILL_BE_REPLACED_PUBLIC_PATH__';
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
    // 节点1是为了可以让vue随时visibility 同时使vue的根节点脱离react的fiber树
    this.vueWrapper1.appendChild(this.vueWrapper2);
  }

  componentDidMount = async () => {
    const rootEleWrapper = this.rootNodeWrapper.current;
    if (!rootEleWrapper) throw Error('没有vue组件的root节点');
    const component = await this.getOriginVueComponent();
    if (component && typeof component !== 'object') return;
    const lifecycles = this.registerVueComponent(this.vueWrapper2, component, this.currentName);
    this.parcel = mountRootParcel((lifecycles as ParcelConfig), { domElement: '-' });
    if (this.visible) rootEleWrapper.appendChild(this.vueWrapper1);
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
    (this.vueWrapper1 as any) = null;
    (this.vueWrapper2 as any) = null;
    this.parcel.unmount();
  }

  private registerVueComponent = (el: string | HTMLElement, vueComponent: object, id: string) => {
    const vueInstance = singleSpaVue({
      Vue,
      appOptions: {
        el: typeof el === 'string' ? `#${el}` : el,
        render: (h: any) => h('div', { attrs: { id } }, [h(vueComponent, {
          props: { ...this.props.extraProps }
        })]),
      },
    });
    return ({
      bootstrap: vueInstance.bootstrap,
      mount: vueInstance.mount,
      unmount: vueInstance.unmount,
    })
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
    if (reg.test(code)) {
      const codeStr = code.replace(reg, publicPath);
      const originCodeFn = new Function("self", codeStr);
      originCodeFn(internalSelf);
    } else {
      const temporaryDocument = (window.document as any);
      const originCurrentScript = window.document.currentScript;
      const temporaryScript = document.createElement('script');
      temporaryScript.src = publicPath;
      temporaryDocument.currentScript = temporaryScript;
      const originCodeFn = new Function("self", code);
      originCodeFn(internalSelf);
      temporaryDocument.currentScript = originCurrentScript;
      temporaryScript.remove && temporaryScript.remove();
    };
    return internalSelf;
  } 

  private getOriginVueComponent = (): object => {
    return new Promise(res => {
      this.getOriginCode(this.currentUrl).then(data => {
        /**
         * 先尝试直接通过XMLHttpRequest获取源代码
         */
        if (!data || typeof data !== 'string') throw Error('没有加载到远程vue组件');
        const internalSelf = this.executeOriginCode(data);
        if (!this.currentName) (this.currentName = this.getCurrentName(internalSelf));
        if (!this.currentName) throw Error('没有获取到vue组件, 造成问题的原因可能是远程组件并未遵循umd规范');
        this.vueWrapper2.id = this.currentName;
        this.component = internalSelf[this.currentName];
        res(this.component);
      }).catch(err => {
        /**
         * 如果通过ajax获取不到的话 可能是跨域 通过创建script标签尝试获取
         */
        const oScript1 = document.createElement('script');
        oScript1.type = 'text/javascript';
        const originSelf = window.self;
        oScript1.innerText = 'window.self = {Vue: null}';
        document.body.appendChild(oScript1);
        window.self.Vue = Vue;
        const oScript2 = document.createElement('script');
        oScript2.type = 'text/javascript';
        oScript2.src = this.currentUrl;
        document.body.appendChild(oScript2);
        oScript2.onload = () =>{
          const currentSelf: any = window.self;
          (window as any).self = originSelf;
          if (!this.currentName) (this.currentName = this.getCurrentName(currentSelf));
          if (!this.currentName) throw Error('没有获取到vue组件, 造成问题的原因可能是远程组件并未遵循umd规范');
          this.vueWrapper2.id = this.currentName;
          this.component = currentSelf[this.currentName];
          oScript1.parentNode?.removeChild(oScript1);
          oScript2.parentNode?.removeChild(oScript2);
          return res(this.component);
        };
        console.warn(`${this.currentName} 这个vue组件可能存在跨域或网络请求错误`);
      });
    })    
  }

  render = () => (<div id={this.props.id || ''} ref={this.rootNodeWrapper} />)
}
