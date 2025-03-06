import { useState, useEffect } from 'react';
import Tables from './Tables';
import View from './View';

const { ipcRenderer } = window.electron;

function App() {
  const [windowType, setWindowType] = useState(null);

  useEffect(() => {
    ipcRenderer.once('window', (arg) => {
      console.log('arg', arg);
      setWindowType(arg);
    });
  });

  if (!windowType) return <h1>No window loaded</h1>;

  return (
    <>
      {windowType === 'main' && <Tables />}
      {windowType === 'view' && <View />}
    </>
  );
}

export default App;
