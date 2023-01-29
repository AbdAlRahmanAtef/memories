import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import posts from "./routes/posts.js";
import users from "./routes/users.js";

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//---------Routes-----------//
app.use("/posts", posts);
app.use("/user", users);

const CONNECTION_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);
mongoose
  .connect(`${CONNECTION_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log("connection established")))
  .catch((err) =>
    console.error({
      error: err.message,
    })
  );
