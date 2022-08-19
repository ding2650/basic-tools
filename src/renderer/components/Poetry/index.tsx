import { useEffect, useState } from 'react';
import { ActionType, IpcMainEvents } from '../../../interface';

const Pretry = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Cliboard, {
      actionType: ActionType.InitPoetry,
    });
    window.electron.ipcRenderer.on(IpcMainEvents.UpdatePoetry, (params) => {
      setData(params);
    });
  }, []);
  const { content, origin } = data;
  if (!content && !origin) return null;
  return (
    <aside className="poetry-container">
      <span>{content}</span>
      <span>-{origin?.author}</span>
    </aside>
  );
};
export default Pretry;
