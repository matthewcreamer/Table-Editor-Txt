/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app, ipcMain } from 'electron';
import fs from 'fs/promises';
import WindowManager from './window-manager';

const windowManager = new WindowManager();

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('selectTable', () => {
  windowManager.closeWindow('view');
});

ipcMain.on('view', async (_, arg) => {
  const viewWindow = await windowManager.createWindow('view', {
    width: 780,
    height: 728,
    fullscreen: false,
  });

  viewWindow.once('ready-to-show', () => {
    viewWindow.webContents.send('fromMainWindow', {
      TableName: arg.TableName,
      Tblidx: arg.Tblidx,
    });
  });
});

ipcMain.handle('read-file', async (_, filePath) => {
  try {
    // Asynchronously read the file and return its content
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`read-file error: ${err}`);
    throw new Error('Failed to read file'); // Propagate the error to the renderer
  }
});

ipcMain.on('read-file-sync', (_, filePath) => {
  try {
    fs.readFile(filePath, 'utf8')
      .then((data) => {
        _.returnValue = data;
      })
      .catch((error) => {
        console.error('read-file-sync:', error);
      });
  } catch (err) {
    console.error(`read-file-sync: ${err}`);
    _.returnValue = null;
  }
});

ipcMain.on('write-file-sync', (_, { path: filePath, data }) => {
  try {
    fs.writeFile(filePath, data)
      .then(() => {
        _.returnValue = true;
      })
      .catch((error) => {
        console.error('read-file-sync:', error);
      });
  } catch (err) {
    console.error(err);
    _.returnValue = false;
  }
});

const createWindows = async () => {
  if (!windowManager.getWindow('main')) {
    await windowManager.createWindow('main', {
      width: 1024,
      height: 728,
      fullscreen: false,
    });
  }
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    await createWindows();
    app.on('activate', async () => {
      await createWindows();
    });
  })
  .catch(console.log);
