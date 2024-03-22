const express = require("express");
const cors = require("cors");
const app = express();
const posts = require("./posts/posts.router");

app.use(cors());
app.use(express.json());

app.use("/posts", posts);

app.get("/", (req, res) => {
    res.send('Hello World!')
});

module.exports = app;