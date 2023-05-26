let jwt = require("jsonwebtoken");
let config = require("../config.json");
var mongoose = require("mongoose");
var userSession = mongoose.model("UserSession");
let response = require("../helper/response");

module.exports = {
    decrypt: function (req, userToken) {
      return new Promise((resolve, reject) => {
          var userData = jwt.verify(userToken, config.secreteKey);
          // console.log("userData", userData);
          userSession
          .findOne({
              _id: userData.sessionId,
              status: {
                  $ne: "deleted",
                },
                userAgent: req.get("User-Agent"),
            })
            .then((resData) => {
            if (resData) {
              req["userId"] = userData._id;
              req["sessionId"] = userData.sessionId;
              req["designation"] = userData.designation;
              resolve();
            } else {
                reject("Unauthorized User")
            }
          })
          .catch((error) => {
            console.log(error);
            reject( "Something went wrong")
          });
      });
    },
  };
  