const { static, Router } = require("express");
const api = Router();
const { join } = require("path");
const logger = require("../logger.js"); 

api.use("/", static(join(__dirname, "..", "views","assets")));

//Handle Login and other stuff

const session = require("express-session");
api.use(
    session({
        secret: "CookieSecretconfig.",
        resave: false,
        saveUninitialized: false,
    })
);

api.use("/", require("./routes"));
// eslint-disable-next-line no-unused-vars
api.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).sendFile(join(__dirname, "..", "views", "error.html"));
});
api.use(function(req,res){
    res.status(404).sendFile(join(__dirname, "..", "views", "error.html"));
});
module.exports = api;
