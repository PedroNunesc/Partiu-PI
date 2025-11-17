import express, { Application } from "express";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import tripRoutes from "./routes/tripRoutes";
import itemRoutes from "./routes/ItemRoutes";
import * as dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tripRoutes);
app.use("/api", itemRoutes)

const PORT = Number(process.env.PORT || "3000");

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
