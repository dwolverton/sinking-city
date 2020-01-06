const { Router } = require("express");
const boardsRoutes = require("./routes-boards");
const gamesRepo = require("./games-repo");
const routes = new Router();

routes.use("/:gameId/board", boardsRoutes);

routes.get("/", async (req, res) => {
  const { client } = req.query;
  const games = await gamesRepo.findByClient(client);
  res.json(games);
});

routes.get("/:gameId", async (req, res) => {
  const { gameId } = req.params;
  const gameJson = await gamesRepo.findByIdJson(gameId);
  if (gameJson) {
    res.type("json").send(gameJson);
  } else {
    res.status(404).json({ error: `Game ${gameId} not found.`});
  }
});

routes.delete("/:gameId", async (req, res) => {
  const { gameId } = req.params;
  const gameJson = await gamesRepo.remove(gameId);
  if (gameJson) {
    // success
    res.status(204).send();
  } else {
    res.status(404).json({ error: `Game ${gameId} not found.`});
  }
});

routes.post("/", async (req, res) => {
  let { body:game } = req;
  game = await gamesRepo.create(game);
  res.status(201).json(game);
});

routes.patch("/:gameId/players/:playerIndex", async (req, res) => {
  let { gameId, playerIndex } = req.params;
  const { body } = req;
  playerIndex = parseInt(playerIndex, 10);
  let game = await gamesRepo.findById(gameId);
  if (game) {
    const player = game.players[playerIndex];
    if (player) {
      if (typeof body.client === "string") {
        player.client = body.client;
      }
      if (typeof body.name === "string") {
        player.name = body.name;
      }
      if (typeof body.role === "number") {
        player.role = body.role;
      }
      await gamesRepo.update(game);
      res.json(player);
    } else {
      res.status(404).json({ error: `Player ${playerIndex} not found.`});
    }
  } else {
    res.status(404).json({ error: `Game ${gameId} not found.`});
  }
});

module.exports = routes;