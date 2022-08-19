/* eslint-disable global-require */
import { Menu, BrowserWindow } from 'electron';

const { NODE_ENV, DEBUG_PROD } = process.env;
const isDev = NODE_ENV === 'development';
const isProdDev = DEBUG_PROD === 'true';
export const isDebug = isDev || isProdDev;
export class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (!isDebug) return;
    this.setupDevelopmentEnvironment();
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }
}

const installSourceMap = () => {
  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }
};

const installElectronBug = () => {
  if (isDebug) {
    require('electron-debug')();
  }
};

export const installExtensions = async () => {
  if (!isDebug) return;
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  // eslint-disable-next-line consistent-return
  return installer.default(
    extensions.map((name) => installer[name]),
    forceDownload
  );
};
const installDebugTools = () => {
  installSourceMap();
  installElectronBug();
};

export default installDebugTools;
