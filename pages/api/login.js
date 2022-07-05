import User from "../../models/User";
import connectDB from "../../middleware/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
    let decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
    if (user) {
      if (req.body.email == user.email && req.body.password == decryptedPass) {
        var token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );
        res.status(200).json({ success: true, user, token, email: user.email });
      } else {
        res.status(400).json({
          error: "User not found, please provide correct Email or Password!",
        });
      }
    } else {
      res.status(400).json({
        error: "User not found, please provide correct Email or Password!",
      });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDB(handler);
