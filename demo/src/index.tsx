import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import VueIFrame, { ReactFrame } from '../../src/index';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
// @ts-ignore
import VueComponent from './components/index.vue';

// import Issue3 from '../issues/issue.3.demo';

const TabPane = Tabs.TabPane;
const Test: React.FC<{}> = () => {
  const [ number1, setNumber1 ] = useState<number>(6);
  const [ active2, setActive2 ] = useState<boolean>(true);
  const [ active3, setActive3 ] = useState<boolean>(true);
  const [ active4, setActive4 ] = useState<boolean>(false);
  const handleClick1 = () => setNumber1(number1 + 1);
  const handleClick2 = () => setActive2(!active2);
  const handleClick3 = () => setActive3(!active3);
  const handleClick4 = () => setActive4(!active4);
  return (
    <div>
      <div>
        <button onClick={handleClick1}>这是react项目的 {number1}</button>
        <button onClick={handleClick2}>点击隐藏第一个本地的vue组件</button>
        <button onClick={handleClick3}>点击隐藏第二个远程vue组件</button>
        <button onClick={handleClick4}>点击激活第三个vue组件 多个不同的vue组件可以共存</button>
      </div>
      <div>
        <VueIFrame jsurl="http://127.0.0.1:20522/vueComponent2.umd.js" visible={active4} />
        <Tabs>
          <TabPane tab={'状态跟踪'} key="1" >
            <VueIFrame component={VueComponent} visible={active2} />
          </TabPane>
          <Tabs.TabPane tab={'查看日志'} key="2" >
            <div className="log-dialog">
              <VueIFrame extraProps={{ number: number1 }} jsurl="http://127.0.0.1:20522/vueComponent1.umd.js" visible={active3} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'凉子阿姨'} key="3" >
            <div className="log-dialog">
              <VueIFrame jsurl="http://127.0.0.1:20522/vueComponent3.umd.js" />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'React组件'} key="4" >
            <div className="log-dialog">
              <ReactFrame
                extraProps={{ number: number1 }}
                jsurl="http://127.0.0.1:20522/reactComponent2.js"
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}


// const Test: React.FC<{}> = () => {
//   return (
//     <Issue3 />
//   )
// }


ReactDOM.render(
  <Test />,
  document.querySelector("#react"),
)



