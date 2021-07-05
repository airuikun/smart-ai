import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// import VueIFrame from '../external-lib/index';
import VueIFrame from '../../src/index';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';

const TabPane = Tabs.TabPane;

const Test: React.FC<{}> = () => {
  const [ number, setNumber ] = useState<number>(1);
  const [ active1, setActive1 ] = useState<boolean>(false);
  const [ active2, setActive2 ] = useState<boolean>(false);
  const handleClick1 = () => setNumber(number + 1);
  const handleClick2 = () => setActive1(!active1);
  const handleClick3 = () => setActive2(!active2);
  return (
    <div>
      <div>
        <button onClick={handleClick1}>change number {number}</button>
        <button onClick={handleClick2}>change iframe active</button>
        <button onClick={handleClick3}>change iframe active2</button>
      </div>
      <div>
        <Tabs>
          <TabPane
            tab={'状态跟踪'}
            key="1"
            className="list-trace-tab"
          >
          {/* <VueFrame
            url="http://127.0.0.1:8877/vueComponent2.umd.js"
            name="vueComponent2"
            activation={true} /> */}
             <VueIFrame
              url="http://127.0.0.1:8877/vueComponent2.umd.js"
              // name="vueComponent2"
              // visible={true}
              // extraProps={{
              //   text: '可以远程传参',
              //   dataName: ['ding1', 'ding2', 'ding3'],
              //   dataNumber: [5, 10, 15],
              // }}
            />
          </TabPane>
          <Tabs.TabPane
            tab={'查看日志'}
            key="2"
            className="list-trace-log"
          >
            <div className="log-dialog">
              这是第二个tab
            </div>
          </Tabs.TabPane>
        </Tabs>
        {/* <VueIFrame
          url="http://127.0.0.1:8877/vueComponent1.umd.js"
          name="vueComponent1"
          activation={active1}
        /> */}
        {/* <VueIFrame
          url="http://127.0.0.1:8877/vueComponent2.umd.js"
          name="vueComponent2"
          activation={active2}
        /> */}
      </div>
    </div>
  )
}


ReactDOM.render(
  <Test />,
  document.querySelector("#react"),
)



