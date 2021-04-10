import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import VueIFrame from '../external-lib/index';

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
        <VueIFrame
          url="http://127.0.0.1:8877/vueComponent1.umd.js"
          name="vueComponent1"
          activation={active1}
        />
        <VueIFrame
          url="http://127.0.0.1:8877/vueComponent2.umd.js"
          name="vueComponent2"
          activation={active2}
        />
      </div>
    </div>
  )
}


ReactDOM.render(
  <Test />,
  document.querySelector("#react"),
)



