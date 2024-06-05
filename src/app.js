const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const companies = require("./companies/companies.router");
const offers = require("./offers/offers.router");
const users = require("./users/users.router");
const colleges = require("./colleges/colleges.router");
const groups = require("./groups/groups.router");
const invites = require("./invites/invites.router");

app.use(cors());
app.use(express.json());
// app.use(cookieParser(process.env.SECRET));

app.use("/companies", companies);
app.use("/offers", offers);
app.use("/users", users);
app.use("/colleges", colleges);
app.use("/groups", groups);
app.use("/invites", invites);

app.get("/", (req, res) => {
    res.send('Hello World!')
});

const jsonErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(400).send({ error: err });
}
app.use(jsonErrorHandler)
module.exports = app;