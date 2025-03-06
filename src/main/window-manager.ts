/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import AppUpdater from './auto-updater';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  async createWindow(
    windowName: string,
    options: {
      width: number;
      height: number;
      fullscreen?: boolean;
    },
  ) {
    if (isDebug) {
      await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

    const window = new BrowserWindow({
      ...options,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
        nodeIntegration: false,
      },
    });

    const baseUrl = resolveHtmlPath('index.html');
    const urlWithRoute = `${baseUrl}?window=${windowName}`;
    window.loadURL(urlWithRoute);

    window.on('ready-to-show', () => {
      if (!window) {
        throw new Error(`"${windowName}" is not defined`);
      }
      if (process.env.START_MINIMIZED) {
        window.minimize();
      } else {
        window.show();
      }
      window.webContents.send('window', windowName);
      if (windowName === 'main') AppUpdater();
    });

    window.on('closed', () => {
      this.windows.delete(windowName);
    });

    const menuBuilder = new MenuBuilder(window);
    menuBuilder.buildMenu();

    window.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    this.windows.set(windowName, window);
    return window;
  }

  getWindow(windowName: string): BrowserWindow | undefined {
    return this.windows.get(windowName);
  }

  showWindow(windowName: string) {
    const window = this.windows.get(windowName);
    if (window) {
      window.show();
    }
  }

  closeWindow(windowName: string) {
    const window = this.windows.get(windowName);
    if (window) {
      window.close();
      this.windows.delete(windowName);
    }
  }
}

export default WindowManager;
