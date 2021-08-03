import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import BaseFrame, { IProps } from './base';

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

const httpReg = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

export default class VueIframe extends BaseFrame {
  framework: typeof Vue;
  currentUrl: string; // 传进来的url
  currentPublicPath: string; // 传进来的url的协议+域名+端口
  component: any;

  constructor(props: IProps) {
    super(props);
    const { jsurl, component } = props;
    this.framework = Vue;
    // 获取到外部传进来的vue组件
    this.component = component;
    // 获取到外部传来的url
    this.currentUrl = jsurl || '';
    // 获取传进来的url的协议+域名+端口
    this.currentPublicPath = `${(httpReg.exec(this.currentUrl) || [''])[0]}/`;
  }

  registerComponent = (el: string | HTMLElement, vueComponent: object, id: string) => {
    const vueInstance = singleSpaVue({
      Vue,
      appOptions: {
        el: typeof el === 'string' ? `#${el}` : el,
        render: (h: any) => h('div', { attrs: { id } }, [h(vueComponent, {
          attrs: { ...this.extraProps },
        })]),
      },
    });
    return ({
      bootstrap: vueInstance.bootstrap,
      mount: vueInstance.mount,
      unmount: vueInstance.unmount,
      update: vueInstance.update,
    })
  }

  isComponent = (component: any): boolean => {
    return component && typeof component === 'object' && typeof component.render === 'function';
  }

  executeOriginCode = (code: string): Self => {
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
}
