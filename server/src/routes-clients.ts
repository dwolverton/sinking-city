import redisClient from "./redis-client";
import randomString from "./random-string";
import { Router } from "express";

const routes = Router();

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

export default routes;