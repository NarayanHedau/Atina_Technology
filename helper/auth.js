const jwt = require("jsonwebtoken");
const config = require("../config.json")
const tokens = require("./token")
const response = require("./response")
module.exports = {
  verify: async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      const token = header.split(" ")[1];
      tokens
        .decrypt(req, token)
        .then((resData) => {
          next();
        })
        .catch((error) => {
          response.errorMsgResponse(res, 401, error);
        });
    } catch (error) {
      res.status(401).json({
        message: "Invalid Token",
      });
    }
  },
};
