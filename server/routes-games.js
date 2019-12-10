const { Router } = require("express");
const routes = new Router();

let games = [
  { 
    id: "22938",
    startTime: "2019-12-09T14:03:00Z", players: [
    { name: "George", role: 0, client: "123" },
    { name: "Thomas", role: 4, client: "123" }
  ]}
];

routes.get("/", (req, res) => {
  const { client } = req.query;
  res.json(games.filter(game => game.players.some(player => player.client === client)));
});

module.exports = routes;