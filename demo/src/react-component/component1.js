import React, { useState } from 'react';
import VueIframe from './index';

const Test = () => {
  const [ number, setNumber ] = useState(1);
  const handleClick = () => setNumber(number + 1);

  const [ active, setActive ] = useState(false);
  const [ active2, setActive2 ] = useState(false);
  const handleClick2 = () => setActive(!active);
  const handleClick3 = () => setActive2(!active2);
  return (
    <div>
      <button onClick={handleClick}>change number</button>
      <button onClick={handleClick2}>change iframe active</button>
      <button onClick={handleClick3}>change iframe active2</button>
      <div>{number}</div>
      <div id="vue-component-mount-root">
      </div>  
      <div id="vue-component-mount-root-2"></div>
      <VueIframe url="http://127.0.0.1:8877/vueComponent1.umd.js" name="vueComponent1" activation={active} />
      <VueIframe url="http://127.0.0.1:8877/vueComponent2.umd.js" name="vueComponent2" activation={active2} />
    </div>
  )
}

export default Test;
