import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Lens = () => {
  const { products } = useContext(ShopContext);

  // Filter products by category "Lenses" (for lens products)
  const lenses = products.filter(product => product.category === "Eyewear" && product.subCategory === "Lenses");

  return (
    <div className=''>
      <div className='flex justify-between text-base sm:text-2xl mb-4'>
        <p>Lenses</p>
        <select className='border-2 border-gray-300 text-sm px-2'>
          <option value="relevant">Relevant</option>
          <option value="low-high">Low to high</option>
          <option value="high-low">High to low</option>
        </select>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
        {lenses.map((product) => (
          <div key={product._id} className='flex flex-col items-center border border-gray-200 p-4 rounded-lg'>
            <Link to={`/product/${product._id}`}>
            <img 
              src={product.image[0]} 
              alt={product.name} 
              className='w-full h-32 object-cover mb-2'
            />
            <h3 className='text-lg font-semibold'>{product.name}</h3>
            <p className='text-gray-600'>${product.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lens;
