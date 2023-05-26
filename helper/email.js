var nodemailer = require("nodemailer");


module.exports = {
  sendMail: (from, to, subject, body) => {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nhedau4786@gmail.com",
          pass: "Golu@123",
        },
      });
      var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: body,
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

