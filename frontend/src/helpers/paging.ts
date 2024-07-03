export const parseLink = (linkHeader: string) => {
  if (!linkHeader) return 0;
  function hasRel(x) {
    return x && x.rel;
  }

  function intoRels(acc, x) {
    function splitRel(rel) {
      acc[rel] = { ...x, rel: rel };
    }

    x.rel.split(/\s+/).forEach(splitRel);

    return acc;
  }

  function createObjects(acc, p) {
    // rel="next" => 1: rel 2: next
    const m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
    if (m) acc[m[1]] = m[2];
    return acc;
  }

  function parseLinkToObj(link) {
    try {
      const m = link.match(/<?([^>]*)>(.*)/),
        linkUrl = m[1],
        parts = m[2].split(";"),
        parsedUrl = new URL(linkUrl);
      const qry = new URLSearchParams(parsedUrl.search);

      parts.shift();

      let info = parts.reduce(createObjects, {});
      info = { ...Object.fromEntries(qry), ...info };
      info.url = linkUrl;
      return info;
    } catch (e) {
      return null;
    }
  }
  const parsed = linkHeader
    .split(/,\s*</)
    .map(parseLinkToObj)
    .filter(hasRel)
    .reduce(intoRels, {});

  let lastPage = 1;
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
