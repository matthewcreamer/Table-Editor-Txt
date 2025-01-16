/* eslint-disable no-console */
const { ipcRenderer } = window.electron;

export const config = JSON.parse(
  ipcRenderer.sendSync('read-file-sync', './config.json'),
);

export const UpdateConfig = () => {
  ipcRenderer.sendSync('write-file-sync', {
    path: './config.json',
    data: JSON.stringify(config, null, 2),
  });
};
