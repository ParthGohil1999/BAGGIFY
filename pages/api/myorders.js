import Order from "../../models/Order";
import connectDB from "../../middleware/mongoose";
import jsonWebTokenError from "jsonwebtoken";

const handler = async (req, res) => {
  const token = req.body.token;
  const data = jsonWebTokenError.verify(token, process.env.JWT_SECRET);
  let orders = await Order.find({ email: data.email, status: 'Paid' });
  res.status(200).json({ orders });
};

export default connectDB(handler);
