import User from "../../models/User";
import connectDB from "../../middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    let user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let dbuser = await User.findOne({ email: user.email });
    const bytes = CryptoJS.AES.decrypt(dbuser.password, process.env.AES_SECRET);
    let decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
    if (
      decryptedPass == req.body.oldpassword &&
      req.body.password == req.body.cpassword
    ) {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.AES_SECRET
          ).toString(),
        }
      );
      // console.log(dbuser)
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid Credintials" });
    }
  } else {
    res
      .status(400)
      .json({ error: "Oops! Something went wrong, please try again!" });
  }
};

export default connectDB(handler);
