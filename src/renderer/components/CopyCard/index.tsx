import { ActionType, CopyCardProps, IpcMainEvents } from 'interface';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Input from '../common/Input';
import CardItem from './Card';
import parse from './const';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [cardList, setCardList] = useState([] as Array<CopyCardProps>);
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const renderList = useMemo(() => {
    if (!inputValue) return cardList;
    return cardList.filter((v) => {
      return v.alias
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });
  }, [inputValue, cardList]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Card, {
      actionType: ActionType.InitList,
    });
    window.electron.ipcRenderer.on('openCard', (arg = []) => {
      const initCardList = arg as Array<CopyCardProps>;
      setCardList(initCardList);
      setInputValue('');
    });
  }, []);

  const onAdd = (payload) => {
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Card, {
      actionType: ActionType.AddCard,
      payload,
    });
  };

  const onEdit = (payload, oldAlias) => {
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Card, {
      actionType: ActionType.EditCard,
      payload: { ...payload, oldAlias },
    });
  };

  const onDelete = (payload) => {
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Card, {
      actionType: ActionType.DeleteCard,
      payload,
    });
  };

  const onExecute = () => {
    const { actionType, payload } = parse(inputValue);
    actionType === 'add' && onAdd(payload);
    // actionType === 'edit' && onEdit(payload);
    actionType === 'delete' && onDelete(payload);
    setInputValue('');
  };
  return (
    <div className="card-container">
      <header className="card-header">
        <Input
          value={inputValue}
          onChange={onInputChange}
          onEnter={onExecute}
        />
      </header>
      <div className="card-body">
        {renderList.map((v) => {
          return (
            <CardItem
              item={v}
              key={v.alias}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Index;
