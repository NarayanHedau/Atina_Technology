let router = require("express").Router();
let response = require("../../helper/response");
const mongoose = require("mongoose");
const Contact = mongoose.model("Contact");
const User = mongoose.model("User");
const auth = require("../../helper/auth");

router.post("/create", auth.verify, async (req, res) => {
  try {
    let userId = req.userId;
    let userData = await User.findOne({ _id: userId })
    if (userData) {
      let data = {
        fullname: `${userData.firstname} ${userData.lastname}`,
        address: req.body.address,
        contactno: userData.contactno,
        zip: req.body.zip,
        email: userData.email,
        created_by: userId
      }
      let createContact = await Contact(data).save();
      response.successResponse(res, 200, "Contact added successfully", createContact)
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, "Internal Server Error")
  }
})

router.get("/get/contact/details", auth.verify,  async (req, res) => {
  try {
    const getDetails = await Contact.find().populate({ path: "created_by", select: "-password" })
    response.successResponse(res, 200, "Data fetched successfully", getDetails)
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, "Internal Server Error")

  }
})

router.get("/get/user/details/with/contactDetails", auth.verify,  async (req, res) => {
  try {
    const data = [];
    const userData = await User.find({_id: req.userId}).select("-password")
    const contactData = await Contact.find()
    for (let user of userData) {
      user = JSON.parse(JSON.stringify(user));
      const userId = user._id;
      let contactArr = [];
      for (let contact of contactData) {
        let contactUserId = contact.created_by
        if (userId == contactUserId) {
          contactArr.push(contact)
        }
      }
      user.contactDetails = contactArr;
      data.push(user)
    }
    response.successResponse(res, 200, "Data fetched successfully", data)
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, "Internal Server Error")

  }
})





module.exports = router;