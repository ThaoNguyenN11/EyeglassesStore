import React from 'react'
import Title from './Title';
import ProductItem from './ProductItem';
import { useState } from 'react';
import { assets } from '../assets/assets';

const LatestCollection1 = () => {
        
        const [latestProducts, setLatestProducts] = useState([
            {
              _id: 'p_c1',
              image: [assets.p_c1], 
              name: 'Stylish Eyeglasses',
              price: '49.99'
            },
            {
              _id: 'p_c2',
              image: [assets.p_c2],
              name: 'Modern Sunglasses',
              price: '89.99'
            },
            {
              _id: 'p_c3',
              image: [assets.p_c3],
              name: 'Classic Frames',
              price: '39.99'
            },
            {
              _id: 'p4',
              image: [assets.p_c4],
              name: 'Fashion Lens',
              price: '29.99'
            },
            {
              _id: 'p5',
              image: [assets.p_c1],
              name: 'Elegant Glasses',
              price: '79.99'
            },
          ]);
        
        return (
          <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
              <Title text1={'Latest'} text2={'collection'} />
              <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Explore bold frames, sleek lenses, and timeless designs crafted for every look.
              </p>
            </div>
      
            <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
              {
                latestProducts.map((item, index) => (
                  <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))
              }
            </div>
          </div>
        );

}

export default LatestCollection1





