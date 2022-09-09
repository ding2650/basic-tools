import { Clipboard } from 'electron';
import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      cliboard: Clipboard;
      ipcRenderer: {
        sendMessage(channel: Channels, args: object): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
