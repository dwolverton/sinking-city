const redis = require("redis");
const client = redis.createClient("redis://localhost:6379");

client.on("error", function (err) {
  console.error("Error " + err);
});

module.exports = client;