import express from "express";
import cors from "cors";
import gamesRoutes from "./routes-games";
import clientsRoutes from "./routes-clients";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/games", gamesRoutes);
app.use("/clients", clientsRoutes);

const port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});