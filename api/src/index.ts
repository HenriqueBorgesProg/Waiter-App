import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";

import { router } from "./router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
export const io = new Server(server);

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    const port = 3001;

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );

      next();
    });
    app.use(
      "/uploads",
      express.static(path.resolve(__dirname, "..", "uploads")),
    );
    app.use(express.json());
    app.use(router);

    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Failed to connect to MongoDB");
  });
