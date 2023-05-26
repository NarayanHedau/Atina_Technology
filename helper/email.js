var nodemailer = require("nodemailer");


module.exports = {
  sendMail: (option) => {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          user: "temp1@gmail.com",
          pass: "temp@123",
        },
      });
      var mailOptions = {
        from: option.from,
        to: option.to,
        subject: option.subject,
        html: option.html,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(info.response);
        }
      });
    });
  },
};

