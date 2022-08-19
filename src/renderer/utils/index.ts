// eslint-disable-next-line import/prefer-default-export
export const isValid = (str: string) => {
  return /\S/g.test(str);
};
