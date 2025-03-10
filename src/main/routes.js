import { Router, Route } from 'electron-router-dom';

import App from './App';
import View from './View';
import View2 from './View2';

export default function AppRoutes() {
  return (
    <Router
      main={<Route path="/" element={<App />} />}
      view={<Route path="/view" element={<View />} />}
      view2={<Route path="/view2" element={<View2 />} />}
    />
  );
}
