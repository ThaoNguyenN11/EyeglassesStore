import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';

const Product = () => {
  const { productID } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [color, setColor] = useState('');

  // Gọi API để lấy thông tin sản phẩm
  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/product/single/${productID}`);
      if (response.data.success && response.data.data) {
        setProductData(response.data.data);
        setSelectedImage(''); // Không có hình ảnh trong dữ liệu, bạn có thể cập nhật lại
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productID]);

  if (!productData) return <div>Loading...</div>;

  // Hàm xử lý khi nhấn "Add to Cart"
  const handleAddToCart = () => {
    if (!color) {
      alert('Please select a color');
      return;
    }
    alert('Product added to cart!'); // Thông báo thêm sản phẩm thành công
  };

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Hình ảnh sản phẩm */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {/* Bạn có thể thêm hình ảnh sản phẩm ở đây */}
          </div>
          <div className='w-full sm:w-[80%]'>
            {/* Hiện thị hình ảnh sản phẩm ở đây */}
            <img className='w-full h-auto' src={selectedImage || 'default_image.jpg'} alt={productData.productName} />
          </div>
        </div>

        {/* Thông tin chi tiết sản phẩm */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.productName}</h1>
          <div className='flex item-center gap-1 mt-2'>
            {Array.from({ length: 5 }).map((_, index) => (
              <img
                key={index}
                className='w-3.5'
                src={index < 4 ? assets.star_icon : assets.star_dull_icon}
                alt='star'
              />
            ))}
            <p className='pl-2'>(12)</p>
          </div>

          <p className='mt-5 text-3xl font-medium'>
            {productData.discountedPrice ? productData.discountedPrice : productData.price} VND
          </p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Chọn màu */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Color:</p>
            <div className='flex gap-2'>
              {productData.color.map((item, index) => (
                <button
                  onClick={() => setColor(item)}
                  className={`border py-2 px-4 bg-gray-100 ${item === color ? 'border-orange-500' : ''}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>Cash on Delivery</p>
            <p>Exchange and Cashback</p>
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Review</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
