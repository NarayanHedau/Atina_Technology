const mongoose = require("mongoose");


const User = new mongoose.Schema(
  {
    firstname: { type: String},
    lastname: { type: String},
    userName: { type: String},
    email: { type: String  },
    password:{type:String},
    phone: { type: String },
    otp:{type:Number},
    status:{type:String, default:"Active"}
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", User);
