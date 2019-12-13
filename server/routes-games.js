const { Router } = require("express");
const routes = new Router();

let nextGameId = 2;

let games = [
  { 
    id: 1,
    startTime: "2019-12-09T14:03:00Z", players: [
    { name: "George", role: 0, client: "123" },
    { name: "Thomas", role: 4, client: "123" }
  ]}
];

routes.get("/", (req, res) => {
  const { client } = req.query;
  res.json(games.filter(game => game.players.some(player => player.client === client)));
});

routes.get("/:gameId", (req, res) => {
  const gameId = parseInt(req.params.gameId, 10);
  const game = games.find(g => g.id === gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: `Game ${gameId} not found.`});
  }
});

routes.post("/", (req, res) => {
  const { body:game } = req;
  game.id = nextGameId++;
  games.push(game);
  res.status(201).json(game);
});

routes.patch("/:gameId/players/:playerIndex", (req, res) => {
  const gameId = parseInt(req.params.gameId, 10);
  const playerIndex = parseInt(req.params.playerIndex, 10);
  const { body } = req;
  const game = games.find(g => g.id === gameId);
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
        player.role = body.naroleme;
      }
      res.json(player);
    } else {
      res.status(404).json({ error: `Player ${playerIndex} not found.`});
    }
  } else {
    res.status(404).json({ error: `Game ${gameId} not found.`});
  }
});

module.exports = routes;