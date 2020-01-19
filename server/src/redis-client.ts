import redis from "redis";
const client:redis.RedisClient = redis.createClient("redis://localhost:6379");

client.on("error", function (err) {
  console.error("Error " + err);
});

export default client;
