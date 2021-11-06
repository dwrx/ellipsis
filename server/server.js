const express = require("express");
const bodyParser = require("body-parser");

const ENV = process.env.NODE_ENV || "production";
const CONFIG = require("./config/config.json")[ENV];
const PORT = CONFIG.webserverPort;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("build"));

if (ENV === "development") {
  app.use(express.static("public"));
}

app.use("", require("./routes/miso"));
app.use("/eps", require("./routes/eps"));

app.listen(PORT, () => {
  console.log(`Starting web server at http://127.0.0.1:${PORT}`);
});
