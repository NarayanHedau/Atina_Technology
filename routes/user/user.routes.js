let router = require("express").Router();
let response = require("../../helper/response");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const auth = require("../../helper/auth");
const bcrypt = require("bcrypt");
let saltRounds = 10;
let jwt = require("jsonwebtoken");
let config = require("../../config.json")
let secreteKey = "secreteKey"
const crypto = require("crypto");
const email = require("../../helper/email")
const userSession = mongoose.model("UserSession")

//  Create an API to register to user table
router.post("/register", async (req, res) => {
  try {
    const userData = await User.findOne({
      $or: [{ email: req.body.email },
      { userName: req.body.userName },
      { phone: req.body.phone },]
    })
    if (userData) {
      response.successResponse(res, 200, "User already registerd")
    } else {
      let data = req.body;
      bcrypt.genSalt(saltRounds, async function (err, salt) {
        bcrypt.hash(data.password, salt, async function (err, hash) {
          data["password"] = hash;
          var user = await new User(data).save();
          if (user) {
            response.successResponse(res, 200, "User registerd successfully", user)
          } else {
            response.errorMsgResponse(res, 500, "Internal Server Error")
          }
        })
      });
    }
  } catch (error) {
    console.log(error)
    response.errorMsgResponse(res, 500, "Internal Server Error")

  }
})

//  Create login API
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password, userName } = req.body;
    let findUser = await User.findOne({
      $or: [{ email: email }, { userName: userName }, { phone: phone }],
    });

    if (!findUser) {
      response.successResponse(res, 200, "email or mobile number not found")
    } else {
      findUser = JSON.parse(JSON.stringify(findUser));
      let matchPasword = await bcrypt.compare(password, findUser.password);
      if (matchPasword) {
        let resSessionUpdate = await userSession
          .updateMany(
            {
              userId: findUser._id,
            },
            {
              status: "deleted",
            },
            {
              $new: true,
            }
          )
        if (resSessionUpdate) {
          var data = {
            userId: findUser._id,
            userAgent: req.get("User-Agent"),
          };
          var userSessionAdd = new userSession(data);
          findUser["sessionId"] = userSessionAdd._id;

          userSessionAdd.userToken = "Bearer " + jwt.sign(findUser, config.secreteKey, {
            expiresIn: "24h",
          });
          let resSession = await userSessionAdd.save();
          if (resSession) {
            findUser["token"] = userSessionAdd.userToken;
            response.successResponse(res, 200, "User login successfully", findUser);
          } else {
            response.errorMsgResponse(res, 400, "Internal Server Error")

          }
        } else {
          response.errorMsgResponse(res, 400, "Internal Server Error")

        }
      } else {
        response.errorMsgResponse(res, 401, "email or password is incorrect")
      }
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, "Internal Server Error")

  }
});

// Create an API to get all users from uses table
router.get("/getAll/users", auth.verify, async (req, res) => {
  try {
    let result = await User.find().select("-password");
    response.successResponse(res, 200, "User data retrived successfully", result);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, "Internal Server Error")
  }
})

router.post("/logout", async (req, res) => {
  try {
    const userData = await userSession.deleteOne({ _id: req.body.userId });
    console.log(userData);
    response.successResponse(res, 200, "Logout successfully");
  } catch (error) {
    log.error("error", error);
    response.errorMsgResponse(res, 500, "Internal Server Error")
  }
});

router.get("/send/otp/forgot/password/:email", async (req, res) => {
  try {
    let validData = await User.findOne({
      email: req.params.email,
    })
    if (validData) {
      let otp = Math.floor(1000 + Math.random() * 9000)
      if (req.params.email) {
        let updateOTP = await User.findOneAndUpdate({ email: req.params.email }, { otp: otp, })
        if (updateOTP) {

          var mailOptions = {
            from: "wankhedeabhijit6@gmail.com",
            to: req.params.email,
            subject: "OTP sent",
            html: `The OTP is ${otp}`,
          };
          let emailSend = await email.sendMail(mailOptions)
          if (emailSend) {
            response.successResponse(res, 200, "otp sent " + otp);
          } 
        }
      }
    }
  } catch (error) {
    response.errorMsgResponse(res, 500, "Internal Server Error")
  }

});

router.post("/forget/password", async (req, res) => {
  try {
    const { email, otp } = req.body;
    let userData = await User.findOne({ email: email });
    if (userData) {
      let otpData = await User.findOne({
        email: email,
        otp: otp,
      });
      if (otpData) {
        let obj = {};
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, async function (err, hash) {
            let updateData = await User.findOneAndUpdate(
              { email: email, otp: otp },
              { password: hash, otp: null }
            );
            response.successResponse(
              res,
              200,
              "password updated Now you can login"
            );
          });
        });
      } else {
        response.errorMsgResponse(res, 401, "WRONG_OTP");
      }
    } else {
      response.errorMsgResponse(res, 401, "EMAIL NOT FOUND");
    }
  } catch (error) {
    response.errorMsgResponse(res, 500, "Internal Server Error")
  }
});

//changePassword
router.post("/change/password", auth.verify, async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    console.log("userdata", userData);
    if (userData) {
      const passResult = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (!passResult) {
        res.status(200).json({ message: "Wrong credentials" });
      }
      console.log("passResult", passResult);
      if (passResult) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
            User.findOneAndUpdate(
              {
                email: req.body.email,
                password: userData.password,
              },
              {
                password: hash,
              }
            )
              .then((resData) => {
                ``;
                console.log("hash", hash);
                response.successResponse(
                  res,
                  200,
                  "password updated Now you can login"
                );
              })
              .catch((error) => {
                console.log("error", error);
                response.errorMsgResponse(
                  res,
                  301,
                  "Something went wrong"
                );
              });
          });
        });
      }
    } else {
      response.errorMsgResponse(res, 301, "Something went wrong");
    }
  } catch (error) {
    console.log("error", error);
    response.errorMsgResponse(res, 500, "Internal Server Error")
  }
});

module.exports = router;
