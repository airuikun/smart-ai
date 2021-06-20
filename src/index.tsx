import React from 'react';
import Vue from 'vue';
import { mountRootParcel, LifeCycles, ParcelConfig } from 'single-spa';
import singleSpaVue from 'single-spa-vue';
import axios from 'axios';

const __VUE_INTERNAL_INIT__ = Vue.prototype._init;
Vue.prototype._init = function(options: any) {
  /**
   * TODO: 留个口儿 用来以后支持加载整个Vue应用(目前只支持加载组件)
   */
  __VUE_INTERNAL_INIT__.call(this, options);
};

interface IProps {
  name: string | number;
  url: string;
  visible?: boolean;
  extraProps?: { [propName: string]: any };
  publicPathWillBeReplacedKeyWord?: string;
}

export default class VueIframe extends React.PureComponent<IProps, any> {
  private currentName: string; // 每个iframe的唯一标识
  private visible: boolean; // 是否显示
  private currentUrl: string; // 传进来的url
  private currentPublicPath: string; // 传进来的url的协议+域名+端口
  private publicPathKey: string; // 远程源代码中要被替换的关键字
  private publicPathReg: RegExp; // 用来替换源代码中关键字的正则
  // private rootNode: HTMLDivElement = document.createElement('div'); // vue组件挂载的root
  private rootNodeWrapper = React.createRef<HTMLDivElement>(); // vue挂载节点是根据el再往上找它的爹
  private parcel: any;
  private vueWrapper1: HTMLDivElement = document.createElement('div');
  private vueWrapper2: HTMLDivElement = document.createElement('div');

  constructor(props: IProps) {
    super(props);
    const { url, name, visible, publicPathWillBeReplacedKeyWord } = props;
    // 初始化时候是否显示
    this.visible = typeof visible === 'boolean' ? visible : true;
    // 获取到外部传来的url
    this.currentUrl = url;
    // 这个属性是用来标识要替换远程源代码中的publicPath的关键字
    this.publicPathKey = publicPathWillBeReplacedKeyWord || '__WILL_BE_REPLACED_PUBLIC_PATH__';
    // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉
    this.publicPathReg = new RegExp(this.publicPathKey, 'g');
    // 生成每个iframe的唯一表示
    this.currentName = String(name || +new Date());
    // 获取传进来的url的协议+域名+端口
    this.currentPublicPath = `${(
      new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i').exec(this.currentUrl) || ['']
    )[0]}/`;
    // 设置一个内部的挂载节点
    this.vueWrapper2.id = this.currentName;
    this.vueWrapper1.appendChild(this.vueWrapper2);
  }

  private registerVueComponent = (el: string | HTMLElement, vueComponent: Object, id: string) => {
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
    (this.vueWrapper1 as any) = null;
    (this.vueWrapper2 as any) = null;
    this.rootNodeWrapper.current?.removeChild(this.vueWrapper1);
    this.parcel.unmount();
  }
  
  componentDidMount = () => {
    axios.get(this.currentUrl).then(({ data }) => {
      if (!data) throw Error('没有加载到远程vue组件');
      const internalSelf: any = { Vue };
      const rootEleWrapper = this.rootNodeWrapper.current;
      if (!rootEleWrapper) throw Error('没有vue组件的root节点');
      if (this.visible) rootEleWrapper.appendChild(this.vueWrapper1);
      const codeStr = (data || '').replace(this.publicPathReg, this.currentPublicPath);
      const originCodeFn = new Function("self", codeStr);
      originCodeFn(internalSelf);
      const currentComponent = internalSelf[this.currentName];
      const lifecycles = this.registerVueComponent(this.vueWrapper2, currentComponent, this.currentName);
      this.parcel = mountRootParcel((lifecycles as ParcelConfig), { domElement: '-' });
    })
    // mountRootParcel()
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
  }

  render = () => (<div ref={this.rootNodeWrapper} />)
}
