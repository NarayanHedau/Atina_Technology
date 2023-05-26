let express = require("express");
let bodyParser = require("body-parser");

let database = require("./helper/database");
let config = require("./config.json");


database.initModels();
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
database.connect();

require("./routes/index.routes")(app);

app.listen(config.server.port, () => {
  console.log("App listening on port : ", config.server.port);
});
