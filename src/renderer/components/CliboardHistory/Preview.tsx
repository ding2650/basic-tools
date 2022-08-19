import moment from 'moment';
import { useMemo } from 'react';
import { ICopyValProps, SupportType } from '../../../interface';

const Preview = (props: { item: ICopyValProps }) => {
  const {
    item: { value, date, type, url },
  } = props;

  const isIamge = type === SupportType.IMAGE;
  const showDate = useMemo(() => {
    if (!value) return '';
    const now = moment();
    const dif = now.diff(moment(date), 'd');
    if (dif === 0) {
      return `Copied Today ${moment(date).format('HH:mm')}`;
    }
    return moment(date).format('YYYY年MM月DD日 HH:mm');
  }, [date, value]);

  const imgPreviewContent = (
    <div className="preview-img-container">
      <img className="preview-img-item" src={url} alt="preview" />
    </div>
  );

  const textPreviewContent = <code>{value}</code>;
  return (
    <section className="his-preview">
      <pre className="his-pre-body">
        {isIamge ? imgPreviewContent : textPreviewContent}
      </pre>
      <footer className="his-pre-footer">{showDate}</footer>
    </section>
  );
};

export default Preview;
