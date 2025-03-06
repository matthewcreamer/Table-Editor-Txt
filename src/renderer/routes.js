import { Route } from 'react-router-dom';
import { Router } from '../lib/electron-router-dom';
import App from './App';
import View from './View';
import View2 from './View2';

export default function Routes() {
  return (
    <Router
      main={<Route path="/" element={<App />} />}
      view={<Route path="/" element={<View />} />}
      view2={<Route path="/" element={<View2 />} />}
    />
  );
}
