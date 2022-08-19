import { app, NativeImage } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export const setFileName = () => {
  return String(new Date().valueOf());
};

const saveImgCache = (nativeImg: NativeImage) => {
  const buffer = nativeImg.toPNG();

  try {
    const dir = `${app.getPath('userData')}/imgCache`;
    const imgPath = `${dir}/${setFileName()}.png`;

    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    writeFileSync(imgPath, buffer);
    return {
      path: imgPath,
      weight: buffer.length,
    };
  } catch {
    return {
      path: app.getPath('userData'),
      weight: 9999,
    };
  }
};
export default saveImgCache;
