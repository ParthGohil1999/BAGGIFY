import User from "../../models/User";
import connectDB from "../../middleware/mongoose";
import jsonwebtoken from 'jsonwebtoken'

const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    let user = jsonwebtoken.verify( token, process.env.JWT_SECRET );
    let dbuser = await User.findOne({ email: user.email });
    // console.log(dbuser)
    const {name, email, address, phone, pincode, city, state} = dbuser
    res.status(200).json({ name, email, address, phone, pincode, city, state });
  } else {
    res.status(400).json({ error: "Oops! Something went wrong, please try again later!" });
  }
};

export default connectDB(handler);
