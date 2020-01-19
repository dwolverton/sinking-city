import redisClient from "./redis-client";
import randomString from "./random-string";
import _ from "lodash";
import GameMetadata from "./temp/GameMetadata";

export function findByIdJson(id:string):Promise<string> {
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

export async function findById(id:string):Promise<GameMetadata|null> {
  const str = await findByIdJson(id);
  return str ? JSON.parse(str) : null;
}

export function findByClientJson(client:string):Promise<string[]> {
  return new Promise((resolve, reject) => {
    redisClient.smembers(key_gamesForClient(client), (err, gameIds) => {
      if (err) {
        reject(err);
      } else {
        resolve(Promise.all(gameIds.map(findByIdJson)).then(jsons => _.filter(jsons)));
      }
    });
  });
}

export async function findByClient(client:string):Promise<GameMetadata[]> {
  return (await findByClientJson(client)).map(str => JSON.parse(str));
}

export function create(game:GameMetadata):Promise<GameMetadata> {
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

export function update(game:GameMetadata):Promise<GameMetadata> {
  const id:string = <string>game.id;
  const multi = redisClient.multi();
  multi.watch(key_game(id));
  return findById(id).then(oldGame => new Promise<GameMetadata>((resolve, reject) => {
    if (!oldGame) {
      reject(`Game ${id} not found.`);
      return;
    }
    let prevClients = getClients(oldGame);
    let nextClients = getClients(game);
    let addedClients = _.difference(nextClients, prevClients);
    let removedClients = _.difference(prevClients, nextClients);
    const value = JSON.stringify(game);

    multi.set(key_game(id), value)
    for (let client of addedClients) {
      multi.sadd(key_gamesForClient(client), id);
    }
    for (let client of removedClients) {
      multi.srem(key_gamesForClient(client), id);
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

export function remove(gameId:string):Promise<boolean> {
  return new Promise((resolve, reject) => {
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
            multi.del(key_game(<string>game.id));
            for (let client of removedClients) {
              multi.srem(key_gamesForClient(client), <string>game.id);
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

function getNextGameId():Promise<string> {
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

function key_game(id:string):string {
  return "game:" + id;
}

function key_gamesForClient(client:string):string {
  return "gamesForClient:" + client;
}

function key_nextGame() {
  return "nextGame";
}

function getClients(game:GameMetadata):string[] {
  if (!game) {
    return [];
  }
  return <string[]>_.uniq(_.filter(game.players.map(p => p.client)));
}