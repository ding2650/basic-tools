import React, {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActionType,
  ICopyValProps,
  SupportType,
  IpcMainEvents,
} from '../../../interface';
import isImage from '../../../main/utils/isImageType';
import { isValid } from '../../utils';
import Poetry from '../Poetry';
import CopyItem, { onCopyItem } from './CopyItem';
import Input from './Input';
import Preview from './Preview';

const BaseHeight = 24;
const CliboardWindow = () => {
  const [list, setList] = useState<Array<ICopyValProps>>([]);
  const [currentVal, setCurrentVal] = useState('');
  const [filterWords, setFilterWords] = useState('');
  const containerRef = useRef<HTMLElement>(null);

  const currentItem = useMemo(() => {
    return list.find((v) => v.value === currentVal) || ({} as ICopyValProps);
  }, [currentVal, list]);

  const currentIndex = useMemo(() => {
    return list.findIndex((v) => v.value === currentVal);
  }, [currentVal, list]);
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(IpcMainEvents.Cliboard, {
      actionType: ActionType.InitList,
    });
    window.electron.ipcRenderer.on('openWindow', (arg) => {
      const initList = arg as Array<ICopyValProps>;
      setList(initList);
      setCurrentVal(initList[0]?.value || '');
      setFilterWords('');
    });
  }, []);

  const fixScroll = (type: 'next' | 'last') => {
    const el = containerRef.current!;
    if (type === 'next') {
      el.scrollTop += BaseHeight;
    } else {
      el.scrollTop -= BaseHeight;
    }
  };
  useLayoutEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          window.electron.ipcRenderer.sendMessage(IpcMainEvents.Cliboard, {
            actionType: ActionType.Hide,
          });
          break;
        case 'ArrowDown':
          if (currentIndex === list.length - 1) return;
          fixScroll('next');
          setCurrentVal(list[currentIndex + 1].value);
          break;
        case 'ArrowUp':
          if (currentIndex === 0) return;
          fixScroll('last');
          setCurrentVal(list[currentIndex - 1].value);
          break;
        default:
          break;
      }
    };
    document.addEventListener('keyup', handler);
    return () => {
      document.removeEventListener('keyup', handler);
    };
  }, [currentIndex, list]);

  const renderList = useMemo(() => {
    const filterList = list.filter((v) => {
      const textIsIncludeWords = v.value.includes(filterWords);
      if (!isValid) return false;
      const isIncludeImg = SupportType.IMAGE.startsWith(
        filterWords.toLocaleLowerCase()
      );
      return textIsIncludeWords || (isIncludeImg && isImage(v.type));
    });
    return filterList;
  }, [list, filterWords]);

  const onkeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const isEnter = key === 'Enter';
    if (isEnter && currentVal) {
      onCopyItem(currentItem);
    }
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilterWords(value);
  };

  const onActive = (item: ICopyValProps) => {
    setCurrentVal(item.value);
  };

  return (
    <div className="full">
      <main id="his-container">
        <header className="his-header">
          <Input value={filterWords} onChange={onInput} onkeydown={onkeydown} />
        </header>
        <div className="his-body">
          <ul ref={containerRef as any} className="his-list">
            {renderList.map((item) => {
              return (
                <CopyItem
                  isActive={item.value === currentVal}
                  item={item}
                  onActive={onActive}
                  key={item.value}
                />
              );
            })}
          </ul>
          <Preview item={currentItem} />
        </div>
        <Poetry />
      </main>
    </div>
  );
};

export default CliboardWindow;