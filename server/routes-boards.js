const { Router } = require("express");
const routes = new Router({mergeParams: true});
const redisClient = require("./redis-client");

// set game board
routes.put("/", (req, res) => {
  const { gameId } = req.params;
  const { body:board } = req;
  const key = "board:" + gameId;
  const value = JSON.stringify(board);
  redisClient.set(key, value, (err, reply) => {
    if (reply === "OK") {
      res.send();
    } else {
      res.status(500).json({err: "Failed to save. Internal Server error."});
    }
  });
});

// generate game board
routes.post("/", (req, res) => {
  const { gameId } = req.params;
  res.status(405).send("Board generation not implemented yet.");
});

// get game board
routes.get("/", (req, res) => {
  const { gameId } = req.params;
  const key = "board:" + gameId;
  redisClient.get(key, (err, value) => {
    console.log(value);
    if (!value) {
      res.status(404).json({ err: "Not Found" });
    } else {
      res.type("json");
      res.send(value);
    }
  })
});

module.exports = routes;