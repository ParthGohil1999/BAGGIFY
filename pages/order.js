import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MdPaid } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import Order from "../models/Order";
import mongoose from "mongoose";
import { BsKey } from "react-icons/bs";

const MyOrder = ({ order, clearCart }) => {
  const [products, setProducts] = useState({});
  // console.log(products);
  const router = useRouter();
  const [date, setDate] = useState();
  useEffect(() => {
    if (!order) {
      router.push("/");
    } else {
      setProducts(order.products);
      const d = new Date(order.createdAt);
      setDate(d);
      if (router.query.clearCart == 1) {
        clearCart();
      }
    }
  }, []);
  return (
    <>
      {order && (
        <div className="flex md:flex-row my-1 mx-auto flex-col justify-center">
          <div
            className="lg:w-1/2 w-full md:pl-10 pl-4 pr-10 md:pr-4 md:py-12 py-8 bg-white overflow-y-auto overflow-x-hidden h-screen"
            id="scroll"
          >
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              BAGGIFY
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-3">
              Order Id: #{order.orderId}
            </h1>
            {order.status == "Paid" ? (
              <p className="text-green-600 text-sm font-bold">
                Your order has been successfully placed!!
                <span>
                  <br></br>Order placed on:{" "}
                  {date &&
                    date.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </span>
              </p>
            ) : (
              <p className="text-cyan-700 text-sm font-bold">
                Your payment was initiated but not successful*
              </p>
            )}
            {Object.keys(products).map((key) => {
              return (
                <div
                  key={key}
                  className="md:flex items-center mt-14 py-8 border-t border-gray-200"
                >
                  <div className="w-1/4">
                    <img
                      src={products[key].img}
                      alt="product image"
                      className="lg:h-[25vh] m-autor"
                    />
                  </div>
                  <div className="md:pl-3 md:w-3/4">
                    <p className="font-semibold text-sm leading-none text-gray-600 md:pt-0 pt-4">
                      RF293
                    </p>
                    <div className="flex items-center justify-between w-full pt-1">
                      <p className="font-bold text-xl leading-none text-gray-600">
                        {products[key].name}
                      </p>
                    </div>
                    <p className="font-semibold leading-none text-gray-600 pt-3.5">
                      Qty: {products[key].qty}
                    </p>
                    <p className="font-semibold leading-none text-gray-600 pt-3.5">
                      Size: {products[key].size}
                    </p>
                    <p className="font-semibold leading-none text-gray-600 py-3.5">
                      Color: {products[key].variant}
                    </p>
                    <div className="flex items-center justify-between pr-6">
                      <div className="flex itemms-center">
                        <p className="font-semibold leading-none text-gray-600">
                          Price: {products[key].price}
                        </p>
                      </div>
                      <p className="font-bold text-xl leading-none text-gray-600">
                        ${products[key].price * products[key].qty}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="xl:w-1/2 md:w-1/3 xl:w-1/4 w-full bg-gray-100 h-full">
            <div className="flex flex-col md:h-screen px-14 py-20 justify-between overflow-y-auto">
              <div>
                <p className="text-4xl font-black leading-9 text-gray-800">
                  Summary
                </p>

                <p className="text-lg font-black mt-10 leading-9 text-gray-800">
                  Address
                </p>
                <p className="text-md font-black mt-5 leading-9 text-gray-800">
                  Shipping Address :
                </p>
                <p className="font-semibold leading-none text-gray-600">
                  {order.address}
                </p>
                <p className="text-md font-black mt-5 leading-9 text-gray-800">
                  Billing Address :
                </p>
                <p className="font-semibold leading-none text-gray-600">
                  {order.address}
                </p>
              </div>
              <div className="flex items-center justify-between pt-16">
                <p className="font-semibold leading-none text-gray-600">
                  Subtotal
                </p>
                <p className="font-semibold leading-none text-gray-600">
                  ${order.amount}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3">
                <p className="font-semibold leading-none text-gray-600">
                  Shipping
                </p>
                <p className="font-semibold leading-none text-gray-600">NA</p>
              </div>
              <div className="flex items-center justify-between pt-3">
                <p className="font-semibold leading-none text-gray-600">Tax</p>
                <p className="font-semibold leading-none text-gray-600">NA</p>
              </div>
              <div>
                <div className="flex items-center justify-between lg:pt-5 pt-5">
                  <p className="text-2xl leading-normal text-gray-800">Total</p>
                  <p className="text-2xl font-bold leading-normal text-right text-gray-800">
                    ${order.amount}
                  </p>
                </div>
                <div className="flex items-center pb-6 justify-between lg:pt-5 pt-5">
                  <p className="text-2xl leading-normal text-gray-800">
                    Status
                  </p>
                  {order.status == "Paid" ? (
                    <p className="flex items-center text-2xl font-bold leading-normal text-right text-green-600">
                      <AiFillCheckCircle className="mr-1" />
                      {order.status}
                    </p>
                  ) : (
                    <p className="flex items-center text-2xl font-bold leading-normal text-right text-cyan-700">
                      <AiFillCheckCircle className="mr-1" />
                      {order.status}
                    </p>
                  )}
                </div>
                <button className="font-semibold text-lg w-full py-4 bg-cyan-700 hover:bg-cyan-800 rounded text-white">
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONDO_URI);
  }
  let order = await Order.findById(context.query.id);

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default MyOrder;
