import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { CopyCardProps } from '../../../interface/index';

interface IProps {
  item: CopyCardProps;
  onFinish: (value: { alias: string; value: string }) => void;
  onCancel: () => void;
}

const EditCard = (props: IProps) => {
  const {
    item: { alias: defaultAlias, value: defaultValue },
    onFinish,
    onCancel,
  } = props;

  const [alias, setAlias] = useState(defaultAlias);
  const [value, setValue] = useState(defaultValue);

  const onAliasChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAlias(e.target.value);
  const onValueChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const onkeyup = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onFinish({ alias, value });
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };
  return (
    <div className="card-item-editing" role={alias}>
      <div className="edit-item">
        <span>Alias</span>
        <input
          value={alias}
          onKeyUp={onkeyup}
          onChange={onAliasChange}
          placeholder="Please enter alias..."
        />
      </div>
      <div className="edit-item">
        <span>Value</span>
        <input
          value={value}
          onKeyUp={onkeyup}
          onChange={onValueChange}
          placeholder="Please enter value..."
        />
      </div>
    </div>
  );
};

export default EditCard;
