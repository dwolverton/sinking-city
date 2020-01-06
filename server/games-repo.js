const redisClient = require("./redis-client");
const randomString = require("./random-string");
const _ = require("lodash");

function findByIdJson(id) {
  return new Promise((resolve, reject) => {
    redisClient.get(key_game(id), (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}

async function findById(id) {
  const str = await findByIdJson(id);
  return str ? JSON.parse(str) : null;
}

function findByClientJson(client) {
  return new Promise((resolve, reject) => {
    redisClient.smembers(key_gamesForClient(client), (err, gameIds) => {
      if (err) {
        reject(err);
      } else {
        resolve(Promise.all(gameIds.map(findByIdJson)));
      }
    });
  });
}

async function findByClient(client) {
  return (await findByClientJson(client)).map(JSON.parse);
}

function create(game) {
  return getNextGameId().then(id => new Promise((resolve, reject) => {
    game.id = id;
    const value = JSON.stringify(game);
    const multi = redisClient.multi();
    multi.set(key_game(game.id), value);
    for (let client of getClients(game)) {
      multi.sadd(key_gamesForClient(client), game.id);
    }
    multi.exec((err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(game);
      }
    });
  }));
}

function update(game) {
  const multi = redisClient.multi();
  multi.watch(key_game(game.id));
  return findById(game.id).then(oldGame => new Promise((resolve, reject) => {
    let prevClients = getClients(oldGame);
    let nextClients = getClients(game);
    let addedClients = _.difference(nextClients, prevClients);
    let removedClients = _.difference(prevClients, nextClients);
    const value = JSON.stringify(game);

    multi.set(key_game(game.id), value)
    for (let client of addedClients) {
      multi.sadd(key_gamesForClient(client), game.id);
    }
    for (let client of removedClients) {
      multi.srem(key_gamesForClient(client), game.id);
    }
    multi.exec((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(game);
      }
    });
  })).catch(err => {
    multi.discard();
    throw err;
  });
}

function remove(gameId) {
  return new Promise((resolve, rawReject) => {
    function reject(err) {
      redisClient.unwatch(key_game(gameId));
      rawReject(err);
    }

    redisClient.watch(key_game(gameId), err => {
      if (err) {
        reject(err);
      } else {
        findById(gameId).then(game => {
          if (!game) {
            resolve(false);
          } else {
            let removedClients = getClients(game);

            const multi = redisClient.multi();
            redisClient.multi();
            multi.del(key_game(game.id));
            for (let client of removedClients) {
              multi.srem(key_gamesForClient(client), game.id);
            }
            multi.exec((err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          }
        }).catch(reject);
      }
    });
  });
}

function getNextGameId() {
  return new Promise((resolve, reject) => {
    redisClient.incr(key_nextGame(), (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply + "-" + randomString());
      }
    });
  });
}

function key_game(id) {
  return "game:" + id;
}

function key_gamesForClient(client) {
  return "gamesForClient:" + client;
}

function key_nextGame() {
  return "nextGame";
}

function getClients(game) {
  if (!game) {
    return [];
  }
  return _.uniq(game.players.map(p => p.client));
}

module.exports = {
  findById,
  findByIdJson,
  findByClient,
  findByClientJson,
  create,
  update,
  remove
};