import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import BaseFrame, { IProps } from './base';

const httpReg = new RegExp("^https?://[\\w-.]+(:\\d+)?", 'i');

export default class ReactIframe extends BaseFrame {
  framework: typeof React;
  currentUrl: string;
  currentPublicPath: string;
  component: any;

  constructor(props: IProps) {
    super(props);
    const { jsurl, component } = props;
    this.framework = React;
    // 获取到外部传进来的vue组件
    this.component = component;
    // 获取到外部传来的url
    this.currentUrl = jsurl || '';
    // 获取传进来的url的协议+域名+端口
    this.currentPublicPath = `${(httpReg.exec(this.currentUrl) || [''])[0]}/`;
  }

  getDom = () => this.oWrapper2;

  registerComponent = (el: string | HTMLElement, reactComponent: object, id: string) => {
    const reactInstance = singleSpaReact({
      React: React as any,
      ReactDOM: ReactDOM as typeof ReactDOM,
      rootComponent: reactComponent as React.ComponentClass<any, any>,
    });
    return ({
      bootstrap: reactInstance.bootstrap,
      mount: reactInstance.mount,
      unmount: reactInstance.unmount,
      update: (reactInstance as any).update,
    });
  }

  isComponent = (component: any): boolean => {
    return component && typeof component === 'function' ||
      (typeof component === 'object' && component.$$typeof);
  }

  executeOriginCode = (code: string) => {} 
}
