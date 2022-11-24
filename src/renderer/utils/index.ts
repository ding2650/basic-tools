// eslint-disable-next-line import/prefer-default-export
export const isValid = (str: string) => {
  return !/\\n/g.test(str) && /\S/g.test(str);
};
