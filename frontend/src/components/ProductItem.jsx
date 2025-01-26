import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => { // Destructure props
  const { currency } = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}> {/* Use backticks here */}
      <div className='overflow-hidden'> {/* Correct the class name */}
        <img src={image[0]} className='hover:scale-110 transition ease-in-out' alt={name} />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{price}{currency}</p>
    </Link>
  );
};

export default ProductItem;
