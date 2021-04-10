declare module 'external-lib' {
  import * as React from 'react';
  export interface IProps {
    name: string | number;
    activation: boolean;
    url: string;
    publicPathWillBeReplacedKeyWord?: string;
  }
  export default class VueIframe extends React.Component<IProps, any> { }
}
