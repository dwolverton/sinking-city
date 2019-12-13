const express = require("express");
const cors = require("cors");
const gamesRoutes = require("./routes-games");
const clientsRoutes = require("./routes-clients");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/games", gamesRoutes);
app.use("/clients", clientsRoutes);

const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});