function search(str, substring) {
  str = str.toLowerCase();
  substring = substring.toLowerCase();
  if (str.includes(substring)) {
    return true;
  }
  return false;
}
const handleSearch = (keyword, query) => {
  let results = [];
  for (var i = 0; i < keyword.length; i++) {
    if (search(keyword[i].name, query)) {
      results.push(keyword[i]);
    }
  }
  return results;
};

module.exports = { handleSearch };
