import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const Product = () => {
  const { productId } = useParams(); 
  const { products, addToCart } = useContext(ShopContext); 
  const [productData, setProductData] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(''); 
  const [color, setColor] = useState(""); 

  const fetchProductData = () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setSelectedImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]); 

  if (!productData) return <div>Loading...</div>;

  // Hàm để xử lý khi nhấn "Add to Cart"
  const handleAddToCart = () => {
    if (!color) {
      alert("Please select a color"); // Nhắc nhở chọn màu
      return;
    }
    addToCart(productId, color); // Gọi hàm thêm vào giỏ hàng
    alert("Product added to cart!"); // Thông báo thêm sản phẩm thành công
  };

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Thông tin sản phẩm */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Hình ảnh sản phẩm */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img 
                src={item}  
                key={index} 
                alt="" 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                onClick={() => setSelectedImage(item)} 
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={selectedImage} alt={productData.name} />
          </div>
        </div>

        {/* Thông tin chi tiết sản phẩm */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex item-center gap-1 mt-2'>
            {Array.from({ length: 5 }).map((_, index) => (
              <img 
                key={index} 
                className='w-3.5' 
                src={index < 4 ? assets.star_icon : assets.star_dull_icon} 
                alt="star" 
              />
            ))}
            <p className='pl-2'>(12)</p>
          </div>
          
          <p className='mt-5 text-3xl font-medium'>{productData.price} VND</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Chọn màu */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Color:</p>
            <div className='flex gap-2'>
              {productData.colors.map((item, index) => (
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
            onClick={handleAddToCart} // Gọi hàm xử lý khi nhấn nút
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
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
          <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
