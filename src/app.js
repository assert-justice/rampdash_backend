const express = require("express");
const cors = require("cors");
const app = express();
const companies = require("./companies/companies.router");
const offers = require("./offers/offers.router");
const users = require("./users/users.router");

app.use(cors());
app.use(express.json());

// app.use("/posts", posts);
app.use("/companies", companies);
app.use("/offers", offers);
app.use("/users", users);

app.get("/", (req, res) => {
    res.send('Hello World!')
});

const jsonErrorHandler = (err, req, res, next) => {
    res.status(400).send({ error: err });
}
app.use(jsonErrorHandler)
module.exports = app;