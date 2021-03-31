import React from 'React';
import Vue from 'vue';
// @ts-ignore
import { registerApplication, start } from 'external-lib/index';
import singleSpaVue from 'single-spa-vue';
import axios from 'axios';

const registerVueComponent = (id: string, vueComponent: Object) => {
  const vueInstance = singleSpaVue({ 
    Vue,
    appOptions: {
      el: `#${id}`, 
      render: (h: any) => h('div', { attrs: { id } }, [h(vueComponent)])
    }
  });
  return ({
    bootstrap: vueInstance.bootstrap,
    mount: vueInstance.mount,
    unmount: vueInstance.unmount,
  })
}

interface IProps {
  name: string | number;
  activation: boolean;
  url: string;
  publicPathWillBeReplacedKeyWord?: string;
}

export default class VueIframe extends React.Component<any, IProps> {
  private currentName: string; // 每个iframe的唯一标识
  private isMount: boolean = false; // 是否挂载
  private currentUrl: string = ''; // 传进来的url
  private currentPublicPath: string = ''; // 传进来的url的协议+域名+端口
  private publicPathKey: string = ''; // 远程源代码中要被替换的关键字
  private publicPathReg: RegExp; // 用来替换源代码中关键字的正则

  constructor(props: IProps) {
    super(props);
    const { url, publicPathWillBeReplacedKeyWord } = props;
    // 获取到外部传来的url
    this.currentUrl = url;
    // 这个属性是用来标识要替换远程源代码中的publicPath的关键字
    this.publicPathKey = publicPathWillBeReplacedKeyWord || '__WILL_BE_REPLACED_PUBLIC_PATH__';
    // 这个正则会用来把远程源码中的__webpack_require__.p = 'xxxxx' 的xxxxx这个publiPath给替换掉
    this.publicPathReg = new RegExp(this.publicPathKey, 'g');
    // 生成每个iframe的唯一表示
    this.currentName = String(props.name || +new Date());
    // 获取传进来的url的协议+域名+端口
    this.currentPublicPath = `${(
      new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i').exec(this.currentUrl) || ['']
    )[0]}/`;
  }
  
  componentDidMount = () => {
    registerApplication(
      this.currentName, 
      () => {
        return new Promise((resolve, reject) => {
          axios.get(this.currentUrl).then(({ data }) => {
            if (!data) reject('获取远程代码出现了错误');
            // 这里由于自定义了webpack中的self
            // 所以需要给这个self里头传递一个Vue对象
            const internalSelf: any = { Vue };
            /**
             * 这里用传进来的url的origin替换掉源代码中webpack生成的publicPath
             * 否则的话一般vue打包出来的组件的publicPath都是 '/'
             * 直接在这里执行的话就会默认指向当前域然后会404
             * 所以这里希望组件开发的时候将publicPath设置为一个约定好的key
             * 这里用真正的远程路径替换
             */
            const codeStr = (data || '').replace(this.publicPathReg, this.currentPublicPath);
            const originCodeFn = new Function("self", codeStr);
            originCodeFn(internalSelf);
            const currentComponent = internalSelf[this.currentName];
            const lifecycles = registerVueComponent(this.currentName, currentComponent);
            resolve(lifecycles);
          })
        })
      },
      this.getBoolean,
    );
  }

  componentDidUpdate = () => this.props.activation ? this.mount() : this.unmount();

  private getBoolean: () => boolean = () => this.isMount;

  private mount = () => (this.isMount = true) && start();

  private unmount = () => (this.isMount = false) || start();

  render() {
    return (
      <div id={this.currentName}></div>
    )
  }
}


