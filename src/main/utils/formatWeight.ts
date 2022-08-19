// TODO: Format size from B to ['KB','MB','GB',...]
const formatWeight = (fileSize: number) => {
  if (fileSize === 0) {
    return '0 B';
  }
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const srcsize = Math.round(fileSize);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  // eslint-disable-next-line no-restricted-properties
  let size = srcsize / Math.pow(1024, index);
  size = Math.round(size);
  return size + unitArr[index];
};

export default formatWeight;
