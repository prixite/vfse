export const linkParser = (linkHeader: string) => {
  // eslint-disable-next-line
  const re = /<([^\?]+\?[a-z]+=([\d]+))>;[\s]*rel="([a-z]+)"/g;
  let arrRes = [];
  let lastPage = 0;
  while ((arrRes = re.exec(linkHeader)) !== null) {
    lastPage = arrRes[2];
  }

  return parseInt(lastPage);
};
