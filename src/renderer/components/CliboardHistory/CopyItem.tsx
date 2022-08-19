import isImage from '../../../main/utils/isImageType';
import { ActionType, ICopyValProps, IpcMainEvents } from '../../../interface';
import formatWeight from '../../../main/utils/formatWeight';

interface CopyItemProps {
  item: ICopyValProps;
  isActive: boolean;
  onActive: (item: ICopyValProps) => void;
}

export const onCopyItem = (item: ICopyValProps) => {
  window.electron.ipcRenderer.sendMessage(IpcMainEvents.Cliboard, {
    actionType: ActionType.CopyItem,
    payload: item,
  });
};

const CopyItem = (props: CopyItemProps) => {
  const { item, onActive, isActive } = props;
  const { type, value, size, weight } = item;
  const onCopy = () => onCopyItem(item);
  const onMouseEnter = () => onActive(item);
  const imgPreviewLabel = `${size?.width}x${size?.height} (${formatWeight(
    weight!
  )})`;

  return (
    <>
      <li
        onClick={onCopy}
        onMouseEnter={onMouseEnter}
        className={isActive ? 'his-copy-item-active' : 'his-copy-item'}
      >
        {isImage(type) ? (
          <>
            <span className="img-tag">Image</span>
            {imgPreviewLabel}
          </>
        ) : (
          value
        )}
      </li>
    </>
  );
};
export default CopyItem;
