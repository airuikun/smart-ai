import * as React from 'react';
import Vue from 'vue';

export interface IProps0 {
  cssurl?: string;
  name?: string;
  id?: string;
  visible?: boolean;
  extraProps?: { [propName: string]: any };
  loadType?: 'xhr' | 'script';
  instable_publicPath?: string;
}

export interface IProps1 extends IProps0 {
  jsurl: string;
  component?: object;
}

export interface IProps2 extends IProps0 {
  component: object;
  jsurl?: string; 
}

export interface Self {
  Vue: typeof Vue;
  [ propName: string ]: any;
}

export interface ISelecotr {
  'getElementById': NonElementParentNode;
  'querySelector': ParentNode;
  'querySelectorAll': ParentNode;
}

export type IProps = IProps1 | IProps2;

declare class VueFrame extends React.Component<IProps, {}> {
	private loadType: IProps['loadType'];
  private currentName: string;
  private visible: boolean;
  private currentUrl: string;
  private currentCSSUrl: string;
  private currentPublicPath: string;
  private publicPathKey: string;
  private publicPathReg: RegExp;
  private rootNodeWrapper: React.RefObject<HTMLDivElement>;;
  private component: any;
  private parcel: any;
  private oWrapper1: HTMLDivElement;
  private oWrapper2: HTMLDivElement;
  private styleElements: HTMLLinkElement[] | HTMLStyleElement[];

	constructor(props: IProps);
	componentDidMount(): void;
	componentDidUpdate(prevProps: IProps): void;
	componentWillUnmount(): void;
	private initHack(): void;
	private initHackSelector(name: keyof ISelecotr, originSelectorFn: ((id: string) => HTMLElement | null) |
	(<E extends Element = Element>(id: string) => NodeListOf<E>) |
	HTMLCollectionOf<Element>): void;
	private internalHackSelector(selectorMap: { [name: string]: Function },name: keyof ISelecotr,
    codeIsExecuting: boolean,): void;
	private internalHackCSSsandbox(originAppendChild: <T extends Node>(this: any, newChild: T) => T,
	codeIsExecuting: boolean,): void;
	private registerComponentAndMount(component: object): void;
	private addComponentToPage(rootEleWrapper: HTMLDivElement): void;
	private registerVueComponent(el: string | HTMLElement, vueComponent: object, id: string): object;
	private isVueComponent(component: any): boolean;
	private getOriginCode(url: string, method: string, data?: any): Promise<any>;
	private getCurrentName(self: any): string;
	private executeOriginCode(code: string): Self;
	private getOriginVueComponent(): object;

	render(): JSX.Element;
}

declare class ReactFrame extends React.Component<IProps, {}> {
	private loadType: IProps['loadType'];
  private currentName: string;
  private visible: boolean;
  private currentUrl: string;
  private currentCSSUrl: string;
  private currentPublicPath: string;
  private publicPathKey: string;
  private publicPathReg: RegExp;
  private rootNodeWrapper: React.RefObject<HTMLDivElement>;;
  private component: any;
  private parcel: any;
  private oWrapper1: HTMLDivElement;
  private oWrapper2: HTMLDivElement;
  private styleElements: HTMLLinkElement[] | HTMLStyleElement[];

	constructor(props: IProps);
	componentDidMount(): void;
	componentDidUpdate(prevProps: IProps): void;
	componentWillUnmount(): void;
	private initHack(): void;
	private initHackSelector(name: keyof ISelecotr, originSelectorFn: ((id: string) => HTMLElement | null) |
	(<E extends Element = Element>(id: string) => NodeListOf<E>) |
	HTMLCollectionOf<Element>): void;
	private internalHackSelector(selectorMap: { [name: string]: Function },name: keyof ISelecotr,
    codeIsExecuting: boolean,): void;
	private internalHackCSSsandbox(originAppendChild: <T extends Node>(this: any, newChild: T) => T,
	codeIsExecuting: boolean,): void;
	private registerComponentAndMount(component: object): void;
	private addComponentToPage(rootEleWrapper: HTMLDivElement): void;
	private registerVueComponent(el: string | HTMLElement, vueComponent: object, id: string): object;
	private isVueComponent(component: any): boolean;
	private getOriginCode(url: string, method: string, data?: any): Promise<any>;
	private getCurrentName(self: any): string;
	private executeOriginCode(code: string): Self;
	private getOriginVueComponent(): object;

	render(): JSX.Element;
}

export default VueFrame;

export { ReactFrame, VueFrame }
