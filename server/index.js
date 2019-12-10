const express = require("express");
const cors = require("cors");
const gamesRoutes = require("./routes-games");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/games", gamesRoutes);


const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});