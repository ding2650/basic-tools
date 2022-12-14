import {
  clipboard,
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';
import { IpcMainEvents } from '../interface';

export type Channels = IpcMainEvents;
contextBridge.exposeInMainWorld('electron', {
  cliboard: clipboard,
  ipcRenderer: {
    sendMessage(channel: Channels, args: object) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
