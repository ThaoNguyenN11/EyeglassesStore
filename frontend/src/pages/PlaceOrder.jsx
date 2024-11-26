import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { cartItems, clearCart } = useContext(ShopContext);
  const [isCODChecked, setIsCODChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    district: '',
    city: '',
    phoneNumber: '',
  });

  const shippingFee = 10;
  const itemsTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = itemsTotal + shippingFee;
  const navigate = useNavigate();

  // Hàm xử lý thay đổi thông tin từ các input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = () => {
    const isFormValid = Object.values(formData).every(field => field.trim() !== ''); // Kiểm tra tính hợp lệ của biểu mẫu

    if (isFormValid && isCODChecked) {
      // Tạo thông tin đơn hàng
      const order = {
        id: Date.now(), // Sử dụng timestamp làm ID
        status: 'Success',
        from: 'Shop Name', // Thay đổi nếu cần
        to: formData.street + ', ' + formData.district + ', ' + formData.city, // Địa chỉ
        estimatedArrival: '3-5 days', // Thay đổi nếu cần
        paymentMethod: 'Cash on Delivery',
        items: cartItems, // Danh sách sản phẩm
      };

      clearCart(); // Cập nhật giỏ hàng về 0
      navigate('/order', { state: { order } }); // Chuyển đến trang order và truyền thông tin đơn hàng
    } else {
      alert("Please fill in all fields and confirm your payment method."); // Thông báo nếu chưa điền đủ thông tin hoặc chưa chọn phương thức thanh toán
    }
  };

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1="Delivery" text2="Information" />
          </div>
          <div className='flex gap-3'>
            <input
              name="firstName"
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type="text"
              placeholder='First name'
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type="text"
              placeholder='Last name'
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <input
            name="email"
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="email"
            placeholder='Email address'
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="street"
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            placeholder='Street'
            value={formData.street}
            onChange={handleChange}
          />
          <div className='flex gap-3'>
            <input
              name="district"
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type="text"
              placeholder='District'
              value={formData.district}
              onChange={handleChange}
            />
            <input
              name="city"
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type="text"
              placeholder='City'
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <input
            name="phoneNumber"
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            placeholder='Phone number'
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className='mt-8'>
          <div className='mt-8 min-w-80'>
            <p className='text-lg font-semibold'>Cart Total:</p>
            <p>Sub Total: {itemsTotal} VND</p>
            <p>Delivery Fee: {shippingFee} VND</p>
            <p>Total: {total} VND</p>
          </div>

          <div className='mt-12'>
            <p>Payment method</p>
            <div className='flex gap-3 flex-col lg:flex-row'>
              <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <input
                  type="checkbox"
                  checked={isCODChecked}
                  onChange={() => setIsCODChecked(!isCODChecked)}
                  className="mr-2"
                />
                <img src={assets.codlogo} className='h-5 mx-4' alt="Cash on Delivery" />
                <span>Cash on Delivery</span>
              </div>
            </div>

            <div className='w-full text-end mt-8'>
              <button onClick={handlePlaceOrder} className='bg-[#12315F] text-2xl text-white py-2 px-10'>
                Place order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
