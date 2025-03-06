import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

function AppUpdater() {
  log.transports.file.level = 'info';
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
}

export default AppUpdater;
