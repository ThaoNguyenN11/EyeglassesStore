import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import { useState } from 'react';
import ProductItem from './ProductItem';
import{ useEffect } from 'react';


const LatestCollection = () => {
const { products } = useContext(ShopContext);
const [latestProducts, setLatestProducts] = useState([]);

useEffect(() =>{
    setLatestProducts(products.slice(0,10));
},[])

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
        <Title text1={'Latest'} text2={'collection'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Explore bold frames, sleek lenses, and timeless designs crafted for every look. </p>
        </div>

        <div className='grig grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 gay-y-6'>
            {
                latestProducts.map((item, index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                ))
            }
            
        </div>
    </div>
    
  )
}

export default LatestCollection
