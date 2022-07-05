import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: JSON.parse(localStorage.getItem("myuser")).token,
        }),
      });
      let res = await a.json();
      setOrders(res.orders);
      console.log("res", res);
    };
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, []);
  return (
    <div>
      {Object.keys(orders).length === 0 && (
        <div
          className="bg-teal-100 border-t-4 mb-[42vh] border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md m-6"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Sorry, you do not have any order history</p>
              <p className="text-sm">
                Please order something!
              </p>
            </div>
          </div>
        </div>
      )}
      <div className=" md:bg-slate-100">
        {orders
          .map((item) => {
            return (
              <div
                key={item._id}
                className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto"
              >
                <div className="flex justify-start item-start space-y-2 flex-col ">
                  <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
                    Order Id: #{item.orderId}
                  </h1>
                  <p className="text-base font-medium leading-6 ml-1 text-gray-600">
                    Order placed on:{" "}
                    {new Date(item.createdAt).toString().slice(0, 15)}
                  </p>
                </div>
                <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                  <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className=" w-full md:pl-10 pl-4 pr-10 md:pr-4 md:py-10 py-8 bg-white overflow-y-auto overflow-x-hidden h-[50vh]">
                      <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
                        Customer’s Cart
                      </p>
                      {Object.keys(item.products).map((key) => {
                        return (
                          <div
                            key={item.products[key].name}
                            className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full "
                          >
                            <div className="pb-4 md:pb-8 w-full md:w-40">
                              <img
                                className="w-[12vh]  md:block"
                                src={item.products[key].img}
                                alt="dress"
                              />
                            </div>
                            <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                              <div className="w-full flex flex-col justify-start items-start space-y-8">
                                <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                                  {item.products[key].name}
                                </h3>
                                <div className="flex justify-start items-start flex-col space-y-2">
                                  <p className="font-semibold leading-none text-gray-600">
                                    <span>Price: </span> $
                                    {item.products[key].price}
                                  </p>
                                  <p className="font-semibold leading-none text-gray-600">
                                    <span>Size: </span>{" "}
                                    {item.products[key].size}
                                  </p>
                                  <p className="font-semibold leading-none text-gray-600">
                                    <span>Color: </span>{" "}
                                    {item.products[key].variant}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between space-x-8 items-start w-full">
                                <p className="font-semibold leading-none text-gray-600">
                                  <span>Qty : </span>
                                  {item.products[key].qty}
                                </p>
                                <p className="font-semibold leading-none text-gray-600">
                                  $
                                  {item.products[key].qty *
                                    item.products[key].price}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                      <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800">
                          Summary
                        </h3>
                        <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                          <div className="flex justify-between  w-full">
                            <p className="text-base leading-4 text-gray-800">
                              Subtotal
                            </p>
                            <p className="text-base leading-4 text-gray-600">
                              ${item.amount}
                            </p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-base leading-4 text-gray-800">
                              Discount{" "}
                              <span className="bg-gray-200 p-1 text-xs font-medium leading-3  text-gray-800">
                                STUDENT
                              </span>
                            </p>
                            <p className="text-base leading-4 text-gray-600">
                              NA
                            </p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-base leading-4 text-gray-800">
                              Shipping
                            </p>
                            <p className="text-base leading-4 text-gray-600">
                              NA
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base font-bold leading-4 text-gray-800">
                            Total
                          </p>
                          <p className="text-base font-bold leading-4 text-gray-600">
                            ${item.amount}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800">
                          Shipping
                        </h3>
                        <div className="flex justify-between items-start w-full">
                          <div className="flex justify-center items-center space-x-4">
                            <div className="w-8 h-8">
                              <img
                                className="w-full h-full"
                                alt="logo"
                                src="https://i.ibb.co/L8KSdNQ/image-3.png"
                              />
                            </div>
                            <div className="flex flex-col justify-start items-center">
                              <p className="text-lg leading-6 font-semibold text-gray-800">
                                BlueDart Delivery
                                <br />
                                <span className="font-normal">
                                  Delivery with 24 Hours
                                </span>
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-semibold leading-6 text-gray-800">
                            FREE
                          </p>
                        </div>
                        <Link href={"/order?id=" + item._id}>
                          <a>
                            <div className="w-full flex justify-center items-center">
                              <button className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">
                                View Order Details
                              </button>
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                    <h3 className="text-xl font-semibold leading-5 text-gray-800">
                      Customer
                    </h3>
                    <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                      <div className="flex flex-col justify-start items-start flex-shrink-0">
                        <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                          <img
                            src="https://i.ibb.co/5TSg7f6/Rectangle-18.png"
                            alt="avatar"
                          />
                          <div className=" flex justify-start items-start flex-col space-y-2">
                            <p className="text-base font-semibold leading-4 text-left text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm leading-5 text-gray-600">
                              {item.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                              stroke="#1F2937"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 7L12 13L21 7"
                              stroke="#1F2937"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="cursor-pointer text-sm leading-5 text-gray-800">
                            {item.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                        <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                          <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                            <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                              Shipping Address
                            </p>
                            <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {item.address}
                            </p>
                          </div>
                          <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 ">
                            <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                              Billing Address
                            </p>
                            <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {item.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                          <button className="mt-6 md:mt-0 py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800">
                            Download Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          .reverse()}
      </div>
    </div>
  );
};

export default Orders;
