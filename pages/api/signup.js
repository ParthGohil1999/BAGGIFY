import User from "../../models/User";
import connectDB from "../../middleware/mongoose";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      const { name, email } = req.body;
      let u = new User({
        name,
        email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.AES_SECRET
        ).toString(),
      });
      await u.save();
      res.status(200).json({ success: true, u });
    }else{
      res.status(400).json({ error: "User already exist, please login!" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDB(handler);
