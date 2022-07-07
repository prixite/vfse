export const linkParser = (linkHeader: string) => {
  // eslint-disable-next-line
  const re = /<([^\?]+\?[a-z]+=([\d]+))>;[\s]*rel="([a-z]+)"/g;
  let arrRes = [];
  const parsedLink = [];
  while ((arrRes = re.exec(linkHeader)) !== null) {
    if (!parsedLink.find((obj) => obj.page === arrRes[2]))
      parsedLink.push({
        url: arrRes[1],
        page: arrRes[2],
      });
  }
  return parsedLink;
};
