import { CopyCardProps } from 'interface';

const inferParams = (paramsString: string) => {
  const arr = paramsString.split(' ');
  const keyIndex = arr.findIndex((v) => v === 'as');
  if (keyIndex === -1) {
    return { alias: paramsString, value: paramsString };
  }
  const value = arr.slice(0, keyIndex).join(' ');
  const alias = arr.slice(keyIndex + 1).join(' ');
  return { alias, value };
};

function parse(str: string) {
  let payload = {} as CopyCardProps;
  const actionType = str.split(/\s/).shift();
  switch (actionType) {
    case 'add':
    case 'edit':
      payload = inferParams(str.replace(actionType, '').trim());
      break;
    case 'delete':
      payload = { alias: str.replace('delete', '').trim(), value: '' };
      break;
    default:
      break;
  }
  return { actionType, payload };
}

export default parse;
