const stringSequece = id => {
  let str = '00000000';
  let s = id.toString();
  var xStr = str.substring(0, str.length - s.length);
  return xStr + id;
};
module.exports = { stringSequece };
