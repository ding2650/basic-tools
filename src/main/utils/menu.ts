import { Menu } from 'electron';

const isMac = process.platform === 'darwin';

const setMenu = () => {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
  ];
  const menuTemplate = Menu.buildFromTemplate(isMac ? (template as any) : []);
  Menu.setApplicationMenu(menuTemplate);
};

export default setMenu;
