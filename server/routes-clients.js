const { Router } = require("express");
const routes = new Router();

let nextClientId = 2;

routes.post("/", (req, res) => {
  res.status(201).json({
    client: nextClientId++ + "-" + randomString()
  });
});

function randomString() {
  let str = "";
  for (let i = 0; i < 10; i++) {
    let char = Math.floor(Math.random() * 36).toString(36);
    str += char;
  }
  return str;
}

module.exports = routes;