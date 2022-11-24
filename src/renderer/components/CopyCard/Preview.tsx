import { CopyCardProps } from 'interface';
import moment from 'moment';

interface PreviewProps {
  item: CopyCardProps;
}

const maskFormat = (value: string) => {
  const len = value.length;
  if (len < 5) {
    return `${value.substring(0, 1)}****${value.substring(3, len)}`;
  }
  return `${value.substring(0, 2)}****${value.substring(len - 2, len)}`;
};
const Preview = (props: PreviewProps) => {
  const { value, updateDate } = props.item;

  return (
    <div>
      <div className="card-item-value">
        <span>{maskFormat(value)}</span>
      </div>
      <span className="card-item-tag">
        {moment(updateDate).format('YYYY年MM月DD日 HH:mm:ss')}
      </span>
    </div>
  );
};
export default Preview;
