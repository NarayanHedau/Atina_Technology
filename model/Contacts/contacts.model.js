const mongoose = require("mongoose");

const Contact = new mongoose.Schema(
  {
    fullname: { type: String},
    address: { type: String},
    contactno: { type: String },
    zip:{type:String},
    email: { type: String  },
    created_by: { type:mongoose.Types.ObjectId, ref: "User" },
    status:{type:String, default:"Active"}
  },
  { timestamps: true }
);
module.exports = mongoose.model("Contact", Contact);
