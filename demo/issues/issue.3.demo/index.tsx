import React, { useCallback, useState } from 'react';
import { ReactFrame } from '../../../src';
const TestComponent: React.FC<any> = (props) => {
  const [ file, setReview ] = useState<any>(null);

  const submit = useCallback(() => {
    setReview(null);
    setTimeout(() => {
      const component = (
        <ReactFrame jsurl="http://localhost:20522/issue3.test2.js" />
      )
      setReview(component);
    }, 1000);
  }, [file]);

  const preview = () => {
    const component = (
      <ReactFrame jsurl="http://localhost:20522/issue3.test2.js" />
    )
    setReview(component);
  }

  return (
    <div>
      <button onClick={submit}>submit</button>
      <button onClick={preview}>preview</button>
      <div>
        preview:
        <div>
          {file}
        </div>
      </div>
    </div>
  )
}

export default TestComponent;
