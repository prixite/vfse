export const linkParser = (linkHeader: string) => {
  if (!linkHeader) return 0;
  // eslint-disable-next-line
  const parse = require("parse-link-header");
  let lastPage = 1;
  const parsed = parse(linkHeader);
  if (parsed.first) {
    lastPage = parsed.first.page || 2;
  }
  if (parsed.prev) {
    lastPage = parseInt(parsed.prev.page) + 1 || 2;
  }
  if (parsed.last) {
    lastPage = parsed.last.page;
  }
  return parseInt(lastPage);
};
