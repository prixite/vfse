const ValidateIPaddress = (ipaddress: string) => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      // eslint-disable-line
      ipaddress
    )
  ) {
    return true;
  }
  return false;
};

const isValidURL = (url: string) => {
  const res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g // eslint-disable-line
  );
  return res !== null;
};

const returnSearchedOject = (data, key) => {
  const list = data.filter((item) => item.id == key);
  return list;
};
const hexToRgb = (hex) => {
  const red = parseInt(hex[1] + hex[2], 16);
  const green = parseInt(hex[3] + hex[4], 16);
  const blue = parseInt(hex[5] + hex[6], 16);

  return `rgba(${red},${green},${blue},0.5)`;
};
export { ValidateIPaddress, isValidURL, returnSearchedOject, hexToRgb };
