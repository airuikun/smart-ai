import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import VueIFrame from '../../src/index';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
// @ts-ignore
import VueComponent from './components/index.vue';

const TabPane = Tabs.TabPane;

const Test: React.FC<{}> = () => {
  const [ number1, setNumber1 ] = useState<number>(1);
  const [ active2, setActive2 ] = useState<boolean>(false);
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
        <button onClick={handleClick2}>点击激活第一个本地的vue组件</button>
        <button onClick={handleClick3}>点击激活第二个远程vue组件</button>
        <button onClick={handleClick4}>点击激活第三个vue组件 多个不同的vue组件可以共存</button>
      </div>
      <div>
        <VueIFrame
          url="http://127.0.0.1:8877/vueComponent2.umd.js"
          visible={active4}
        />
        <Tabs>
          <TabPane
            tab={'状态跟踪'}
            key="1"
          >
            <VueIFrame
            component={VueComponent}
            visible={active2}
          />
          </TabPane>
          <Tabs.TabPane
            tab={'查看日志'}
            key="2"
          >
            <div className="log-dialog">
              <VueIFrame
                url="http://127.0.0.1:8877/vueComponent1.umd.js"
                visible={active3}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}


ReactDOM.render(
  <Test />,
  document.querySelector("#react"),
)



