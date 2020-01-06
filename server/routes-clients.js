const { Router } = require("express");
const redisClient = require("./redis-client");
const randomString = require("./random-string");
const routes = new Router();

routes.post("/", async (req, res) => {
  const client = await getNextClientId();
  res.status(201).json({
    client
  });
});

function getNextClientId() {
  return new Promise((resolve, reject) => {
    redisClient.incr(key_nextClient(), (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply + "-" + randomString());
      }
    });
  });
}

function key_nextClient() {
  return "nextClient";
}

module.exports = routes;