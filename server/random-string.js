function randomString() {
  let str = "";
  for (let i = 0; i < 20; i++) {
    let char = Math.floor(Math.random() * 36).toString(36);
    str += char;
  }
  return str;
}

module.exports = randomString;