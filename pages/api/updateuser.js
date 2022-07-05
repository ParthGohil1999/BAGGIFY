import User from "../../models/User";
import connectDB from "../../middleware/mongoose";
import jsonwebtoken from 'jsonwebtoken'

const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    let user = jsonwebtoken.verify( token, process.env.JWT_SECRET );
    let dbuser = await User.findOneAndUpdate({ email: user.email }, {name: req.body.name, address: req.body.address, phone: req.body.phone, pincode: req.body.pincode, city: req.body.city, state: req.body.state});
    // console.log(dbuser)
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "Oops! Something went wrong, please try again!" });
  }
};

export default connectDB(handler);
