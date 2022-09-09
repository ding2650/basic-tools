import { CopyCardProps } from 'interface';
import moment from 'moment';

interface PreviewProps {
  item: CopyCardProps;
}
const Preview = (props: PreviewProps) => {
  const { value, updateDate } = props.item;

  return (
    <div>
      <div className="card-item-value">
        <span>{value}</span>
      </div>
      <span className="card-item-tag">
        {moment(updateDate).format('YYYY年MM月DD日 HH:mm:ss')}
      </span>
    </div>
  );
};
export default Preview;
