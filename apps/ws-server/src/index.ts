import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import websockets from "./websockets";
// import routes from "./routes";

dotenv.config();

const port = process.env.PORT || 4444;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/", routes);

const server = app.listen(port);

websockets(server);

console.log("started server on port:", port);
