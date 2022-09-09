import { CopyCardProps } from '../../../interface/index';
import DeleteIcon from '../icons/DeleteIcon';
import EditIcon from '../icons/EditIcon';

interface IProps {
  item: CopyCardProps;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
}

const ItemHeader = (props: IProps) => {
  const {
    item: { alias },
    onEdit,
    onDelete,
  } = props;

  return (
    <header className="card-item-header">
      <div className="card-alias">{alias}</div>
      <div className="card-handler">
        <EditIcon onClick={onEdit} />
        <DeleteIcon onClick={onDelete} />
      </div>
    </header>
  );
};

export default ItemHeader;
