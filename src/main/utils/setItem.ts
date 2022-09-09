import { clipboard } from 'electron';
import moment from 'moment';
import { CopyCardProps, ICopyValProps, SupportType } from '../../interface';
import saveImgCache from './saveImgCache';

const getCurrentDate = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const setTextItem = (val?: string): ICopyValProps => {
  const value = val || clipboard.readText();
  const from = 'from app';
  return {
    type: SupportType.TEXT,
    value,
    from,
    date: getCurrentDate(),
  };
};

export const setCardItem = (item: CopyCardProps) => {
  return {
    ...item,
    updateDate: getCurrentDate(),
  };
};
export const setImageItem = () => {
  const img = clipboard.readImage();
  const from = 'from app';
  const { path, weight } = saveImgCache(img);
  return {
    type: SupportType.IMAGE,
    size: img.getSize(),
    value: path,
    weight,
    from,
    date: getCurrentDate(),
  };
};
