import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import Moniter from './utils/cliboardMoniter';
import installDebugTools, { installExtensions } from './utils/debugTools';
import getAssetPath from './utils/getAssetPath';
import { resolveHtmlPath } from './utils/resolveHtmlPath';

Menu.setApplicationMenu(null);

let mainWindow: BrowserWindow | null = null;
let m: Moniter;
let appTray = null;

installDebugTools();

app.setLoginItemSettings({
  openAsHidden: true,
});

const createWindow = async () => {
  await installExtensions();
  const windowInstance = new BrowserWindow({
    width: 720,
    height: 475,
    vibrancy: 'dark',
    visualEffectState: 'active',
    transparent: true,
    center: true,
    frame: false,
    show: false,
    alwaysOnTop: true,
    resizable: false,
    icon: getAssetPath('icon.png'),
    type: 'dock',
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      experimentalFeatures: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  windowInstance.loadURL(resolveHtmlPath('index.html'));
  return windowInstance;
};

async function appReady() {
  await app.whenReady();
  app.dock.hide();
  m = new Moniter();
  m.initMessageHandler();
  mainWindow = await createWindow();
  // keep this global link of mainWindow
  m.setWindow(mainWindow);
  m.bindWindowsEvents();
  appTray = m.createTray();
  m.bindInspectElementMenu();
  m.bindAppEvents();
  // keep this global link of tray
  m.setTray(appTray);

  m.registHotKey();
  m.start();
}
appReady();
