import connectDB from "../../middleware/mongoose";
import Forgot from "../../models/Forgot";
import User from "../../models/User";
import CryptoJS from "crypto-js";
var nodemailer = require("nodemailer");

const handler = async (req, res) => {
  if (req.body.sendMail) {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let Fuser = await Forgot.findOne({ email: req.body.email });
      if (Fuser) {
        res.status(400).json({
          success: false,
          message: "You have already requested for password reset",
        });
        // console.log("You have already requested for password reset");
        return;
      }
      let token = Math.floor(Math.random() * Date.now());
      let forgot = new Forgot({
        email: req.body.email,
        token: token,
      });

      await forgot.save();

      let text = `We have sent you this email in response to your request to reset your password on BAGGIFY.com.
     <br/><br/>

     To reset your password, please follow the link :
     <br/><br/>

     <a href="https://baggify.netlify.app/forgot?token=${token}">Click here to reset your password</a>

     <br/><br/>

     We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to your BAGGIFY.com - My Account Page and Change the Password.

     <br/><br/>

    If you need help, or you have any other questions, feel free to email us.`;

      var transporter = nodemailer.createTransport({
        port: 2525,
        host: "smtp.elasticemail.com",
        auth: {
          user: "parth.gohil19@gmail.com",
          pass: process.env.SMTP_PASSWORD,
        },
        secure: false,
      });

      var mailOptions = {
        from: "parth.gohil19@gmail.com",
        to: req.body.email,
        subject: "Reset Password - BAGGIFY.com",
        html: text,
      };

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).json({
            success: false,
            message: error,
          });
        //   console.log("transporterrrrrrrrrrrrrrr :", error);
          return;
        } else {
          res.status(200).json({
            success: true,
            message: "Password reset email successfully sent! " + info.response,
          });
        //   console.log("password reset email successfully sent!", info.response);
          return;
        }
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Sorry, User not found!" });
    //   console.log("Sorry, User not found!!");
      return;
    }
  } else {
    let forgotdb = await Forgot.findOne({ token: req.body.token });
    // console.log("forgotdb", forgotdb);
    if (forgotdb) {
      await User.findOneAndUpdate(
        { email: forgotdb.email },
        {
          password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.AES_SECRET
          ).toString(),
        }
      );
      // console.log(dbuser)
      res.status(200).json({ success: true, message: "Password updated successfully!" });
    //   console.log("password reset successfully")
    await forgotdb.remove()
    } else {
      res.status(400).json({ success: false, message: "Sorry, Invalid link!" });
    //   console.log("Sorry, Invalid link!")
    }
  }
};

export default connectDB(handler);
