let express = require("express");
let bodyParser = require("body-parser");
// let path = require("path");
// let fs = require("fs");
let database = require("./helper/database");
let config = require("./config.json");


database.initModels();
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
database.connect();

// function enableStaticFileServer(expressInstance, folderName, route) {
//   app.use(route, express.static(path.join(__dirname, folderName)));
// }

// enableStaticFileServer(app, config.uploadUrl, "/");

require("./routes/index.routes")(app);

app.listen(config.server.port, () => {
  console.log("App listening on port : ", config.server.port);
});
