import { createElectronRouter } from 'electron-router-dom';

export const { Router, registerRoute } = createElectronRouter({
  port: 4927,

  types: {
    ids: ['main', 'view', 'view2'],
  },
});
