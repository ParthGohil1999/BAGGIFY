import React from "react";
import Link from "next/link";
import Product from "../models/Product";
import mongoose from "mongoose";

const Stickers = ({ products }) => {
  return (
    <div>
      {Object.keys(products).length === 0 && <div
          className="bg-teal-100 border-t-4 mb-52 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md m-5"
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
              <p className="font-bold">Sorry, all the stickers are currently out of stock</p>
              <p className="text-sm">
                Please stay tuned!
              </p>
            </div>
          </div>
        </div> }
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center">
            
            {Object.keys(products).map((item) => {
              return (
                  <Link passHref={true} key={products[item]._id} href={`/product/${products[item].slug}`}>
                    <div className="lg:w-1/6 md:w-1/3 p-4  w-full cursor-pointer shadow-md m-6">
                      <a className="block relative h-48 rounded overflow-hidden">
                        <img
                          alt="ecommerce"
                          className="h-[21vh] m-auto"
                          src={products[item].img}
                        />
                      </a>
                      <div className="mt-4 text-center">
                        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                          {products[item].category}
                        </h3>
                        <h2 className="text-gray-900 title-font text-lg font-medium">
                          {products[item].title}
                        </h2>
                        <p className="mt-1">${products[item].price}</p>
                        <div className="mt-1">
                          {products[item].size.includes('S') && <span className='border border-cyan px-1 mx-1'>S</span>}
                          {products[item].size.includes('M') && <span className='border px-1 mx-1'>M</span>}
                          {products[item].size.includes('L') && <span className='border border-cyan px-1 mx-1'>L</span>}
                          {products[item].size.includes('XL') && <span className='border border-cyan px-1 mx-1'>XL</span>}
                          {products[item].size.includes('XXL') && <span className='border border-cyan px-1 mx-1'>XXL</span>}
                          </div>
                        <div className="mt-1">
                        {products[item].color.includes('Cyan') && <button className="border-2 border-gray-300 ml-1 bg-cyan-200 rounded-full w-5 h-5 focus:outline-none"></button>}
                        {products[item].color.includes('Black') && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-5 h-5 focus:outline-none"></button>}
                        {products[item].color.includes('White') && <button className="border-2 border-gray-300 ml-1 bg-white rounded-full w-5 h-5 focus:outline-none"></button>}
                        {products[item].color.includes('Blue') && <button className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-5 h-5 focus:outline-none"></button>}
                        {products[item].color.includes('Pink') && <button className="border-2 border-gray-300 ml-1 bg-pink-200 rounded-full w-5 h-5 focus:outline-none"></button>}
                        
                        </div>
                      </div>
                    </div>
                  </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONDO_URI);
  }
  let products = await Product.find({category: 'Sticker'});
  let Hoods = {}
  for(let item of products){
    if(item.title in Hoods){
      if(!Hoods[item.title].color.includes(item.color) && item.availableQty > 0){
        Hoods[item.title].color.push(item.color)
      }
      if(!Hoods[item.title].size.includes(item.size) && item.availableQty > 0){
        Hoods[item.title].size.push(item.size)
      }
    }else{
      Hoods[item.title] = JSON.parse(JSON.stringify(item))
      if(item.availableQty > 0){
        Hoods[item.title].color = [item.color]
        Hoods[item.title].size = [item.size]
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(Hoods)) }, // will be passed to the page component as props
  };
}

export default Stickers;
