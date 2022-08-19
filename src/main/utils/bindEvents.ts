import { app } from 'electron';

export const windowBindEvents = (instance: any) => {
  const { window: win } = instance;

  const onClose = (e: any) => {
    e.preventDefault();
    win.hide();
  };

  const readyToShow = () => {
    if (!win) {
      throw new Error('"win" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      win.minimize();
    } else {
      win.show();
    }
  };

  win.on('close', onClose);
  win.on('blur', win.hide);
  win.on('ready-to-show', readyToShow);
};

export const appBindEvents = (instance: any) => {
  const onAllClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
      instance.stop();
    }
  };

  const onActive = () => {
    if (instance.window === null) instance.initWindow();
  };

  app.on('window-all-closed', onAllClosed);
  app.on('activate', onActive);
};

export default {
  window: windowBindEvents,
  app: appBindEvents,
};
