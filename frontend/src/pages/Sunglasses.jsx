import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Sunglasses = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useContext(ShopContext);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/product/list');
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  // Lọc sản phẩm có category là "glassesframe"
  const eyeglasses = products.filter(product => product.category === "Sunglasses");

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

   return (
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-6'>
          <p className='text-xl sm:text-2xl font-semibold text-gray-800'>Sunglasses</p>
          <select className='border-2 border-gray-300 rounded-md text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value="relevant">Relevant</option>
            <option value="low-high">Low to high</option>
            <option value="high-low">High to low</option>
          </select>
        </div>
  
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {eyeglasses.map((product) => {
            const imageUrl = product.variations?.[0]?.imageUrls?.[0] || '/placeholder.jpg';
  
            return (
              <div 
                key={product.productID} 
                className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-2'
              >
                <Link to={`/product/${product.productID}`} className='block'>
                  <div className='relative'>
                    <img 
                      src={imageUrl} 
                      alt={product.productName} 
                      className='w-full h-48 object-cover'
                    />
                  </div>
                  
                  <div className='p-3'>
                    <h3 className='text-base font-semibold text-gray-800 mb-1 truncate'>
                      {product.productName}
                    </h3>
                    <div className='flex justify-between items-center'>
                      <p className='text-sm text-gray-600 font-medium'>
                        {product.price} {currency}
                      </p>
                      <div className='flex space-x-2'>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
};

export default Sunglasses;
