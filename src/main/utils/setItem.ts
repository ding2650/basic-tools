import { clipboard } from 'electron';
import moment from 'moment';
import { ICopyValProps, SupportType } from '../../interface';
import saveImgCache from './saveImgCache';

export const setTextItem = (val?: string): ICopyValProps => {
  const value = val || clipboard.readText();
  const from = 'from app';
  const date = moment().format('YYYY-MM-DD HH:mm:ss');
  return {
    type: SupportType.TEXT,
    value,
    from,
    date,
  };
};

export const setImageItem = () => {
  const img = clipboard.readImage();
  const from = 'from app';
  const date = moment().format('YYYY-MM-DD HH:mm:ss');

  const { path, weight } = saveImgCache(img);

  return {
    type: SupportType.IMAGE,
    size: img.getSize(),
    value: path,
    weight,
    from,
    date,
  };
};
