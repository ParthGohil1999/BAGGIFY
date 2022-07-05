import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Product from "../../models/Product";
import mongoose from "mongoose";
import Error from "next/error";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = ({ buyNow, addToCart, product, variants, error }) => {
  console.log(product, variants);
  const router = useRouter();
  const { slug } = router.query;
  const [pin, setPin] = useState();
  const [service, setService] = useState();

  const [color, setColor] = useState(product.color);
  const [size, setSize] = useState(product.size);

  useEffect(() => {
    if (!error) {
      // alert(product.availableQty);
      console.log("available qty: ", product.availableQty);
      setColor(product.color);
      setSize(product.size);
    }
  }, [router.query]);

  const checkServiceability = async () => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    let pinJson = await pins.json();
    if (Object.keys(pinJson).includes(pin)) {
      setService(true);
      toast.success("Your Pincode is serviceable!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setService(false);
      toast.error("Sorry, Your Pincode is not serviceable!", {
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

  const onChangePin = (e) => {
    setPin(e.target.value);
  };

  const refreshVariant = (newsize, newcolor, e) => {
    let url = `${process.env.NEXT_PUBLIC_HOST}/product/${variants[newcolor][newsize]["slug"]}`;
    router.push(url);
  };

  if (error == 404) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden">
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
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/4 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="h-[50vh] m-auto"
              src={product.img}
            />
            <div className="lg:w-1/2 lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                BAGGIFY
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title} ({product.size}/{product.color})
              </h1>
              <div className="flex mb-4">
                <span className="flex items-center">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-cyan-600"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-cyan-600"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-cyan-600"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-cyan-600"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-cyan-600"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <span className="text-gray-600 ml-3">4 Reviews</span>
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                  Available Qty: {product.availableQty}
                </span>
              </div>
              <p className="leading-relaxed">{product.desc}</p>
              <div className="flex mt-6  items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex">
                  <span className="mr-3">Color</span>
                  {Object.keys(variants).includes("Cyan") &&
                    Object.keys(variants["Cyan"]).includes(size) && (
                      <button
                        onClick={(e) => {
                          refreshVariant(size, "Cyan");
                        }}
                        className="border-2 border-gray-300 bg-cyan-200 rounded-full w-6 h-6 focus:outline-none"
                      ></button>
                    )}
                  {Object.keys(variants).includes("Black") &&
                    Object.keys(variants["Black"]).includes(size) && (
                      <button
                        onClick={(e) => {
                          refreshVariant(size, "Black");
                        }}
                        className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"
                      ></button>
                    )}
                  {Object.keys(variants).includes("White") &&
                    Object.keys(variants["White"]).includes(size) && (
                      <button
                        onClick={(e) => {
                          refreshVariant(size, "White");
                        }}
                        className="border-2 border-gray-300 ml-1 bg-white rounded-full w-6 h-6 focus:outline-none"
                      ></button>
                    )}
                  {Object.keys(variants).includes("Blue") &&
                    Object.keys(variants["Blue"]).includes(size) && (
                      <button
                        onClick={(e) => {
                          refreshVariant(size, "Blue");
                        }}
                        className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none"
                      ></button>
                    )}
                  {Object.keys(variants).includes("Pink") &&
                    Object.keys(variants["Pink"]).includes(size) && (
                      <button
                        onClick={(e) => {
                          refreshVariant(size, "Pink");
                        }}
                        className="border-2 border-gray-300 ml-1 bg-pink-200 rounded-full w-6 h-6 focus:outline-none"
                      ></button>
                    )}
                </div>
                <div className="flex ml-6 items-center">
                  <span className="mr-3">Size</span>
                  <div className="relative">
                    <select
                      value={size}
                      onChange={(e) => {
                        refreshVariant(e.target.value, color);
                      }}
                      className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 text-base pl-3 pr-10"
                    >
                      {Object.keys(variants[color]).includes("S") && (
                        <option value={"S"}>S</option>
                      )}
                      {Object.keys(variants[color]).includes("M") && (
                        <option value={"M"}>M</option>
                      )}
                      {Object.keys(variants[color]).includes("L") && (
                        <option value={"L"}>L</option>
                      )}
                      {Object.keys(variants[color]).includes("XL") && (
                        <option value={"XL"}>XL</option>
                      )}
                      {Object.keys(variants[color]).includes("XXL") && (
                        <option value={"XXL"}>XXL</option>
                      )}
                    </select>
                    <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                {product.availableQty <= 0 ? (
                  <span className="title-font font-medium text-xl">
                    Sorry this product is OutOfStock!
                  </span>
                ) : (
                  <>
                    <span className="title-font font-medium text-2xl text-gray-900">
                      ${product.price}
                    </span>
                    <div className="flex items-end ml-5">
                      <button
                        disabled={product.availableQty <= 0}
                        onClick={() => {
                          buyNow(
                            slug,
                            1,
                            product.price,
                            product.title,
                            size,
                            color,
                            product.img
                          );
                        }}
                        className="flex disabled:bg-blue-300 ml-4 text-white bg-cyan-600 border-0 py-2 px-6 focus:outline-none hover:bg-cyan-700 rounded"
                      >
                        Buy Now
                      </button>
                      <button
                        disabled={product.availableQty <= 0}
                        onClick={() => {
                          addToCart(
                            slug,
                            1,
                            product.price,
                            product.title,
                            size,
                            color,
                            product.img
                          );
                        }}
                        className="flex disabled:bg-blue-300 ml-4 text-white bg-cyan-600 border-0 py-2 px-6 focus:outline-none hover:bg-cyan-700 rounded"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
              <hr className="mt-5" />
              <div className="flex pin mt-5 space-x-2 text-sm">
                <input
                  onChange={onChangePin}
                  className="px-2 w-full  py-2 border-2 rounded border-grey-100"
                  type="number"
                  placeholder="Check pincode serviceability here"
                />
                <button
                  onClick={checkServiceability}
                  className="text-white bg-cyan-600 border-0 py-2 px-6 focus:outline-none hover:bg-cyan-700 rounded"
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  let error = null;
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONDO_URI);
  }
  let product = await Product.findOne({ slug: context.query.slug });
  if (product == null) {
    return {
      props: {
        error: 404,
      }, // will be passed to the page component as props
    };
  }
  let variants = await Product.find({
    title: product.title,
    category: product.category,
  });
  let colorSizeSlug = {};
  for (let item of variants) {
    if (Object.keys(colorSizeSlug).includes(item.color)) {
      colorSizeSlug[item.color][item.size] = { slug: item.slug };
    } else {
      colorSizeSlug[item.color] = {};
      colorSizeSlug[item.color][item.size] = { slug: item.slug };
    }
  }

  return {
    props: {
      error: error,
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(colorSizeSlug)),
    }, // will be passed to the page component as props
  };
}

export default Post;
