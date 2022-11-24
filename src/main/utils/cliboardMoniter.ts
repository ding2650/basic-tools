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
  CopyCardProps,
  ICopyValProps,
  IpcMainEvents,
} from '../../interface';
import { setCardItem, setImageItem, setTextItem } from './setItem';
import bindEvents from './bindEvents';
import getAssetPath from './getAssetPath';
import { MenuBuilder } from './debugTools';
import { CardStorageKey, CliboardStorageKey } from '../../const';
import copyItem from './copyItem';
import isImage from './isImageType';

const store = new Store();

const MAX_COUNT = 100;

enum WindowRouteMap {
  HISTORY = 'HISTORY',
  CARD = 'CARD',
}
export default class Moniter {
  timer: NodeJS.Timer = null as any;

  store = store;

  pageName = '';

  window: BrowserWindow | null = null;

  tray: Tray | null = null;

  currentRoute = WindowRouteMap.HISTORY;

  cliboardList: Array<ICopyValProps> = [];

  cardList: Array<CopyCardProps> = [];

  constructor() {
    this.cliboardList = this.store.get(CliboardStorageKey) || ([] as any);
    this.cardList = this.store.get(CardStorageKey) || ([] as any);
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
          this.updateHistoryList();
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

  addCardItem(newItem: CopyCardProps) {
    this.cardList = [setCardItem(newItem), ...this.cardList];
    this.store.set(CardStorageKey, this.cardList);
    this.window?.webContents.send('openCard', this.cardList);
  }

  editCardItem(val: CopyCardProps & { oldAlias: string }) {
    const { oldAlias, ...newItem } = val;
    const filterList = this.cardList.filter((v) => v.alias !== oldAlias);
    this.cardList = [setCardItem(newItem), ...filterList];
    this.store.set(CardStorageKey, this.cardList);
    this.window?.webContents.send('openCard', this.cardList);
  }

  deleteCardItem(newItem: CopyCardProps) {
    this.cardList = this.cardList.filter((v) => v.alias !== newItem.alias);
    this.store.set(CardStorageKey, this.cardList);
    this.window?.webContents.send('openCard', this.cardList);
  }

  initCardMessageHandler() {
    const run = (arg: ChannelProps) => {
      const { actionType, payload } = arg;
      switch (actionType) {
        case ActionType.AddCard:
          this.addCardItem(payload);
          break;
        case ActionType.EditCard:
          this.editCardItem(payload);
          break;
        case ActionType.DeleteCard:
          this.deleteCardItem(payload);
          break;
        case ActionType.Hide:
          this.window?.hide();
          break;
        case ActionType.InitList:
          this.window?.webContents.send('openCard', this.cardList);
          break;
        default:
          break;
      }
    };
    ipcMain.on(IpcMainEvents.Card, async (_, arg) => {
      run(arg);
    });
  }

  async switchHistoryVisible() {
    const visible = this.window!.isVisible();
    const isHistory = this.currentRoute === WindowRouteMap.HISTORY;
    if (visible && isHistory) {
      this.window!.hide();
      this.window?.webContents.send('hideWindow');
    } else {
      this.updatePoetry();
      this.updateHistoryList();
      this.currentRoute = WindowRouteMap.HISTORY;
      this.window!.show();
    }
  }

  quitApp() {
    this.window?.destroy();
    app.quit();
  }

  switchCardVisible() {
    const visible = this.window!.isVisible();
    const isCard = this.currentRoute === WindowRouteMap.CARD;
    if (visible && isCard) {
      this.window!.hide();
      this.window?.webContents.send('hideWindow');
    } else {
      this.window?.webContents.send('openCard', this.cardList);
      this.window!.show();
      this.currentRoute = WindowRouteMap.CARD;
    }
  }

  createTray() {
    const icon = nativeImage.createFromPath(getAssetPath('tray.png'));
    const tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'cliboard', click: () => this.switchHistoryVisible() },
      { label: 'clear', click: () => this.clearCache() },
      { label: 'card', click: () => this.switchCardVisible() },
      { label: 'quit', click: () => this.quitApp() },
    ]);
    tray.setContextMenu(contextMenu);
    return tray;
  }

  registHotKey() {
    globalShortcut.register('Command+Shift+F', () => this.switchCardVisible());
    globalShortcut.register('Command+Shift+D', () =>
      this.switchHistoryVisible()
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
    this.store.set(CliboardStorageKey, newList);
  }

  clearCache() {
    // TODO: Is it possible to encapsulate a method to delete a folder
    const imgList = this.cliboardList.filter((v) => isImage(v.type));
    imgList.forEach((v) => {
      unlink(v.value, () => {});
    });
    this.store.set(CliboardStorageKey, []);
    this.cliboardList = [];
    this.updateHistoryList();
  }

  reOrder(oldItem: ICopyValProps) {
    console.log('reORder', oldItem);
    const { value } = oldItem;
    const newItem = setTextItem(value);
    this.cliboardList = this.cliboardList.filter((v) => v.value !== value);
    this.syncAdd(newItem);
  }

  updateHistoryList() {
    const newList = this.cliboardList.map((v) => {
      if (!isImage(v.type)) return v;
      return {
        ...v,
        url: nativeImage.createFromPath(v.value).toDataURL(),
      };
    });
    this.window!.webContents.send('openHistory', newList);
  }

  async updatePoetry() {
    try {
      const res = await getPoetry();
      this.window!.webContents.send(IpcMainEvents.UpdatePoetry, res.data);
    } catch (e) {}
  }

  stop() {
    // TODO: When user is inactive, it should be called.
    clearInterval(this.timer);
  }
}
