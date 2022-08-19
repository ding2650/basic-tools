import { clipboard, nativeImage } from 'electron';
import { ICopyValProps } from '../../interface';
import isImage from './isImageType';

const copyItem = (item: ICopyValProps) => {
  const { value, type } = item;
  if (!isImage(type)) {
    clipboard.writeText(value);
  } else {
    clipboard.writeImage(nativeImage.createFromPath(value));
  }
};

export default copyItem;
