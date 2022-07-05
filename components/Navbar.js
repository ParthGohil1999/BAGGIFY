import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineShoppingCart,
  AiFillRightCircle,
  AiFillLeftCircle,
  AiFillPlusCircle,
  AiFillMinusCircle,
} from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { useRouter } from "next/router";

const Navbar = ({
  logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false)
  const router = useRouter()

  // useEffect(() => {
  //   Object.keys(cart).length !== 0 && setSidebar(true)
  // }, [])
  

  const toggleCart = () => {
    setSidebar(!sidebar)
    // if (ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-full");
    //   ref.current.classList.add("translate-x-0");
    // } else if (!ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-0");
    //   ref.current.classList.add("translate-x-full");
    // }
  };
  const ref = useRef();

  return (
    <div className="flex bg-white flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-sm navBar w-full">
      <Link href={"/"}>
        <a>
          <div className="logo mx-5">
            <Image src="/logo.png" alt="" width={210} height={47} />
          </div>
        </a>
      </Link>
      <div className="nav">
        <ul className="flex items-center space-x-4 font-semibold">
          <Link href={"/tshirts"}>
            <a>
              <li className="hover:text-cyan-600">Tshirts</li>
            </a>
          </Link>
          <Link href={"/hoodies"}>
            <a>
              <li className="hover:text-cyan-600">Hoodies</li>
            </a>
          </Link>
          <Link href={"/stickers"}>
            <a>
              <li className="hover:text-cyan-600">Stickers</li>
            </a>
          </Link>
          <Link href={"/mugs"}>
            <a>
              <li className="hover:text-cyan-600">Mugs</li>
            </a>
          </Link>
        </ul>
      </div>
      <div
        onClick={toggleCart}
        className="cart absolute right-0 top-6 md:top-5 mx-5 cursor-pointer text-cyan-700 flex"
      >
        <AiFillLeftCircle className="text-2xl md:text-3xl" />
        {/* <AiOutlineShoppingCart className="text-2xl md:text-3xl" /> */}
      </div>

      <div
        ref={ref}
        className={`w-80 h-[100vh] overflow-y-auto sideCart absolute top-0  bg-cyan-50 px-8 py-10 transform transition-all ${
          sidebar ? "right-0" : "-right-96"
        }`}
      >
        <h2 className="font-bold text-xl text-center mt-5">Shopping Cart</h2>
        <div className="w-12 h-1 mt-2 mx-auto bg-cyan-600 rounded mb-4"></div>
        <span
          // onClick={toggleCart}
          className="absolute top-5 left-6 text-3xl cursor-pointer text-cyan-600"
        >
          {user.value && (
            <MdAccountCircle
              onClick={()=>{setDropdown(!dropdown)}}
            />
          )}
        </span>
        {dropdown && <div className="absolute  text-gray-300 bg-cyan-800 top-12 mt-1 rounded px-7 py-2">
            <ul>
              <Link href={"/myaccount"}><a><li className="py-1.5 text-sm cursor-pointer hover:text-white">My Account</li></a></Link>
              <hr />
              <Link href={"/orders"}><a><li className="py-1.5 text-sm cursor-pointer hover:text-white">My Orders</li></a></Link>
              <hr />
              <a onClick={logout}><li className="py-1.5 text-sm cursor-pointer hover:text-white">Logout</li></a>
            </ul>
        </div>}
        <Link href={"/login"} >
          <span
            onClick={toggleCart}
            className="absolute top-5 left-6 text-3xl cursor-pointer text-cyan-600"
          >
            {!user.value && (
              <button className="flex font-bold  text-white  bg-cyan-600  px-2.5 py-1 focus:outline-none hover:bg-cyan-700 rounded text-sm">
                Login
              </button>
            )}
          </span>
        </Link>
        
        <span
          onClick={toggleCart}
          className="absolute top-4 right-4 text-3xl cursor-pointer text-cyan-600"
        >
          <AiFillRightCircle />
        </span>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length == 0 && (
            <div className="text-center noItems">
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
                    {cart[k].name}({cart[k].size}/{cart[k].variant})
                  </div>
                  <div className="flex items-center justify-center w-1/2 text-xl">
                    <AiFillMinusCircle
                      onClick={() => {
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant,
                          cart[k].img,
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

        {Object.keys(cart).length > 0 && (
          <div className="flex flex-col w-[85%] fixed bottom-8 left-6 justify-center border-2 p-5 border-y-cyan-700 shadow-lg">
            <div className="font-bold mb-2">Subtotal: {subTotal}</div>
            <button
              onClick={clearCart}
              className="flex justify-center text-white font-semibold bg-red-600 border-0 py-2.5 focus:outline-none hover:bg-red-700 rounded text-md"
            >
              <FaTrashAlt className="m-1" />
              Clear Cart
            </button>
            <Link href={"/checkout"}>
              <button className="flex justify-center mt-3 text-white font-semibold bg-cyan-600 border-0 py-2.5 focus:outline-none hover:bg-cyan-700 rounded text-md">
                <BsFillBagCheckFill className="m-1" />
                Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
