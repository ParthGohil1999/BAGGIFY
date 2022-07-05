import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = ({ cart, clearCart, subTotal, addToCart, removeFromCart }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({ value: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser && myuser.token) {
      setUser(myuser);
      setEmail(myuser.email);
      fetchData(myuser.token);
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (
      name.length > 3 &&
      email.length > 3 &&
      phone.length > 3 &&
      address.length > 3 &&
      pincode.length == 6
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, phone, address, pincode]);

  const fetchData = async (token) => {
    let data = { token };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    var res = await a.json();
    console.log(res);
    setName(res.name);
    setAddress(res.address);
    setPhone(res.phone);
    setPincode(res.pincode);
    setCity(res.city);
    setState(res.state);
  };

  const handleChange = async (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "phone") {
      setPhone(e.target.value);
    } else if (e.target.name == "address") {
      setAddress(e.target.value);
    } else if (e.target.name == "pincode") {
      setPincode(e.target.value);
      if (e.target.value.length == 6) {
        let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
        let pinJson = await pins.json();
        if (Object.keys(pinJson).includes(e.target.value)) {
          setState(pinJson[e.target.value][1]);
          setCity(pinJson[e.target.value][0]);
        } else {
          setState("");
          setCity("");
        }
      } else {
        setState("");
        setCity("");
      }
    }
  };

  const initiatePayment = async () => {
    setLoading(true)
    let oid = Math.floor(Math.random() * Date.now());
    // Get a transaction token
    const data2 = {
      cart,
      subTotal,
      oid,
      email,
      name,
      address,
      pincode,
      city,
      state,
      phone,
    };

    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    });
    var txnRes = await a.json();
    // console.log("txnRes", txnRes);
    if (txnRes.success) {
      let txnToken = txnRes.txnToken;
      // console.log("txn", txnToken);
      var config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: oid /* update order id */,
          token: txnToken /* update token value */,
          tokenType: "TXN_TOKEN",
          amount: subTotal /* update amount */,
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log("init");
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
        },
      };

      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
          setLoading(false)
        })
        .catch(function onError(error) {
          console.log("error => ", error);
          setLoading(false)
        });
    } else {
      console.log(txnRes.error);
      if (txnRes.cartClear) {
        clearCart();
        setLoading(false)
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
      toast.error(txnRes.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className="container mx-auto p-5">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Script
        type="application/javascript"
        crossorigin="anonymous"
        src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
      />
      <h1 className="font-bold text-cyan-700 text-2xl mt-8 text-center">
        Checkout
      </h1>
      <div className="w-12 h-1 my-2 mx-auto bg-cyan-600 rounded mb-4"></div>
      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Name
            </label>
            <input
              onChange={handleChange}
              value={name}
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            {user && user.token ? (
              <input
                value={user.email}
                type="email"
                id="email"
                name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                readOnly
              />
            ) : (
              <input
                onChange={handleChange}
                value={email}
                type="email"
                id="email"
                name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            )}
          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">
            Address
          </label>
          <textarea
            onChange={handleChange}
            value={address}
            id="address"
            name="address"
            cols="30"
            rows="2"
            className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          ></textarea>
        </div>
      </div>
      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
              Phone
            </label>
            <input
              placeholder="Your 10 digit phone number"
              onChange={handleChange}
              value={phone}
              type="phone"
              id="phone"
              name="phone"
              className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label
              htmlFor="pincode"
              className="leading-7 text-sm text-gray-600"
            >
              PinCode
            </label>
            <input
              onChange={handleChange}
              value={pincode}
              type="text"
              id="pincode"
              name="pincode"
              className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">
              District
            </label>
            <input
              onChange={handleChange}
              value={city}
              type="text"
              id="city"
              name="city"
              className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>

        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">
              State
            </label>
            <input
              onChange={handleChange}
              value={state}
              type="text"
              id="state"
              name="state"
              className="w-full bg-white rounded border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
      </div>
      <h2 className="font-semibold text-xl">2. Review Cart Items</h2>
      <div className=" bg-cyan-50 p-6 my-5">
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length == 0 && (
            <div className="text-center m-5">
              <div className="w-20 h-20 rounded-full inline-flex items-center justify-center text-3xl bg-red-600 text-white">
                <GoAlert />
              </div>
              <div className="flex flex-col items-center text-center justify-center">
                <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                  No items in the cart
                </h2>
                <div className="w-12 h-1 bg-red-500 rounded mt-2 mb-4"></div>
              </div>
            </div>
          )}
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-5">
                  <div className="w-1/1 font-semibold">
                    {cart[k].name} ({cart[k].size}/{cart[k].variant})
                  </div>
                  <div className="flex items-center justify-center w-1/3 text-xl">
                    <AiFillMinusCircle
                      onClick={() => {
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant,
                          cart[k].img
                        );
                      }}
                      className="text-cyan-600 cursor-pointer"
                    />
                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                    <AiFillPlusCircle
                      onClick={() => {
                        addToCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant,
                          cart[k].img
                        );
                      }}
                      className="text-cyan-600 cursor-pointer"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <span className="font-bold">Subtotal: {subTotal}</span>
      </div>
      <div>
        {loading ? (
          <button
            diasbled={true}
            type="button"
            className="cursor-not-allowed flex font-bold w-32 justify-center mt-3 text-white  bg-cyan-600 border-0 py-2.5 focus:outline-none hover:bg-cyan-700 rounded text-md"
          >
            <svg
              role="status"
              className="inline my-auto w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <Link href={"/checkout"}>
            <button
              disabled={disabled}
              onClick={initiatePayment}
              className="disabled:bg-blue-200 flex font-bold w-32 justify-center mt-3 text-white  bg-cyan-600 border-0 py-2.5 focus:outline-none hover:bg-cyan-700 rounded text-md"
            >
              <BsFillBagCheckFill className="m-1" />
              Pay - {subTotal}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Checkout;
