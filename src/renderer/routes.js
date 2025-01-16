import { createElectronRouter } from 'electron-router-dom';
import App from './App';
import View from './View';
import View2 from './View2';

const router = createElectronRouter([
  {
    windowName: 'main',
    path: '/',
    component: App,
  },
  {
    windowName: 'view',
    path: '/',
    component: View,
  },
  {
    windowName: 'view2',
    path: '/',
    component: View2,
  },
]);

export default router;
