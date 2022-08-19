import {
  clipboard,
  BrowserWindow,
  globalShortcut,
  nativeImage,
  Tray,
  app,
  Menu,
  ipcMain,
} from 'electron';
import Store from 'electron-store';
import { unlink } from 'fs';
import { getPoetry } from '../api';
import {
  ActionType,
  ChannelProps,
  ICopyValProps,
  IpcMainEvents,
} from '../../interface';
import { setImageItem, setTextItem } from './setItem';
import bindEvents from './bindEvents';
import getAssetPath from './getAssetPath';
import { MenuBuilder } from './debugTools';
import { StorageKey } from '../../const';
import copyItem from './copyItem';
import isImage from './isImageType';

const store = new Store();

const MAX_COUNT = 100;
export default class Moniter {
  timer: NodeJS.Timer = null as any;

  store = store;

  window: BrowserWindow | null = null;

  tray: Tray | null = null;

  cliboardList: Array<ICopyValProps> = [];

  constructor() {
    this.cliboardList = this.store.get(StorageKey) || ([] as any);
  }

  isTextChange() {
    const latestVal = clipboard.readText();
    return latestVal && !this.cliboardList.find((v) => v.value === latestVal);
  }

  isImageChange() {
    const currentImg = clipboard.readImage('clipboard');
    const { width, height } = currentImg.getSize();
    if (currentImg.isEmpty()) return false;
    const lastImg = this.cliboardList.find((v) => isImage(v.type));
    if (!lastImg) return true;
    const { width: lastImgWidth, height: lastImgHeight } = lastImg!.size as any;
    return lastImgWidth !== width && lastImgHeight !== height;
  }

  initMessageHandler() {
    const handerFn = (arg: ChannelProps) => {
      const { actionType, payload } = arg;
      switch (actionType) {
        case ActionType.CopyItem:
          copyItem(payload);
          this.window!.hide();
          this.reOrder(payload);
          break;
        case ActionType.InitList:
          this.updateRenderer();
          this.updatePoetry();
          break;
        case ActionType.Hide:
          this.window?.hide();
          break;
        default:
          break;
      }
    };
    ipcMain.on(IpcMainEvents.Cliboard, async (_, arg) => {
      handerFn(arg);
    });
  }

  async switchWindowVisible() {
    const visible = this.window!.isVisible();
    if (visible) {
      this.window!.hide();
    } else {
      this.updatePoetry();
      this.updateRenderer();
      this.window!.show();
    }
  }

  quitApp() {
    this.window?.destroy();
    app.quit();
  }

  createTray() {
    const icon = nativeImage.createFromPath(getAssetPath('tray.png'));
    const tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'cliboard', click: () => this.switchWindowVisible() },
      { label: 'clear', click: () => this.clearCache() },
      { label: 'quit', click: () => this.quitApp() },
    ]);
    tray.setContextMenu(contextMenu);
    return tray;
  }

  registHotKey() {
    globalShortcut.register('Command+Shift+F', () =>
      this.switchWindowVisible()
    );
  }

  setWindow(w: BrowserWindow) {
    this.window = w;
  }

  setTray(tray: Tray) {
    this.tray = tray;
  }

  bindInspectElementMenu() {
    const menuBuilder = new MenuBuilder(this.window!);
    menuBuilder.buildMenu();
  }

  bindWindowsEvents() {
    bindEvents.window(this);
  }

  bindAppEvents() {
    bindEvents.app(this);
  }

  async start() {
    this.timer = setInterval(() => {
      if (this.isTextChange()) {
        this.syncAdd(setTextItem());
        return;
      }
      if (this.isImageChange()) {
        this.syncAdd(setImageItem());
      }
    }, 1000);
  }

  syncAdd(newVal: ICopyValProps) {
    const newList = [newVal, ...this.cliboardList];
    if (newList.length > MAX_COUNT) {
      const { type, value } = newList.pop() as ICopyValProps;
      if (isImage(type)) {
        unlink(value, () => {});
      }
    }
    this.cliboardList = newList;
    this.store.set(StorageKey, newList);
  }

  clearCache() {
    const imgList = this.cliboardList.filter((v) => isImage(v.type));
    imgList.forEach((v) => {
      unlink(v.value, () => {});
    });

    this.store.set(StorageKey, []);
    this.cliboardList = [];
    this.updateRenderer();
  }

  reOrder(oldItem: ICopyValProps) {
    const { value } = oldItem;
    const newItem = setTextItem(value);
    this.cliboardList = this.cliboardList.filter((v) => v.value !== value);
    this.syncAdd(newItem);
  }

  updateRenderer() {
    const newList = this.cliboardList.map((v) => {
      if (!isImage(v.type)) return v;
      return {
        ...v,
        url: nativeImage.createFromPath(v.value).toDataURL(),
      };
    });
    this.window!.webContents.send('openWindow', newList);
  }

  async updatePoetry() {
    try {
      const res = await getPoetry();
      this.window!.webContents.send(IpcMainEvents.UpdatePoetry, res.data);
    } catch (e) {}
  }

  stop() {
    clearInterval(this.timer);
  }
}
