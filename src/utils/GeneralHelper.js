export const sortColumn = (a, b, sortOrder, key) => {
  if (a[key] && b[key]) {
    if (sortOrder === "ascend") {
      return b[key] - a[key];
    } else {
      return a[key] - b[key];
    }
  }
};

export const simpleSort = (a, b, key) => {
  if (a[key] && b[key]) {
    return a[key].localeCompare(b[key]);
  }
};

export const convertToProperCase = (value) => {
  if (value && value.length > 0) {
    let convertedCase = value.toLowerCase();
    convertedCase = Object.values(convertedCase);
    convertedCase[0] = convertedCase[0].toUpperCase();
    return convertedCase;
  } else {
    return "Something went wrong!";
  }
};
