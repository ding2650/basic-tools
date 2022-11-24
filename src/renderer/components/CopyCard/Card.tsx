import { ChangeEvent, useLayoutEffect, useState } from 'react';
import {
  ActionType,
  CopyCardProps,
  IpcMainEvents,
} from '../../../interface/index';
import EditCard from './EditCard';
import ItemHeader from './Header';
import Preview from './Preview';

interface IProps {
  item: CopyCardProps;
  onEdit: (newItem: CopyCardProps, oldAlias: string) => void;
  onDelete: (Item: CopyCardProps) => void;
}

const isInside = (path: Array<HTMLElement>, targetRole: string) => {
  return path.some((node) => {
    return node.role === targetRole;
  });
};

const Card = (props: IProps) => {
  const { item, onEdit, onDelete } = props;
  const [isEdit, setIsEdit] = useState(false);

  const onCopy = () => {
    window.electron.cliboard.writeText(item.value, 'clipboard');
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Card, {
      actionType: ActionType.Hide,
    });
  };

  useLayoutEffect(() => {
    const monitor = (e: any) =>
      !isInside(e.path, item.alias) && setIsEdit(false);

    document.body.addEventListener('click', monitor);
    return () => {
      document.body.removeEventListener('click', monitor);
    };
  }, [item.alias]);

  const handleEdit = (e: ChangeEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsEdit(true);
  };
  const handleDelete = (e: ChangeEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onDelete(item);
  };
  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleFinish = (e) => {
    onEdit(e, item.alias);
    handleCancel();
  };

  if (isEdit) {
    return (
      <EditCard item={item} onCancel={handleCancel} onFinish={handleFinish} />
    );
  }
  return (
    <>
      <div className="card-item" onClick={onCopy}>
        <ItemHeader item={item} onEdit={handleEdit} onDelete={handleDelete} />
        <Preview item={item} />
      </div>
      <></>
    </>
  );
};

export default Card;
