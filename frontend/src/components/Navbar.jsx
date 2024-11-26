import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; 

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { cartItems } = useContext(ShopContext); // Lấy cartItems từ ShopContext

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'>
        <img src={assets.logo1} className='w-36' alt="Logo" />
      </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>Homepage</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/>
        </NavLink>
        <NavLink to='/eyeglasses' className='flex flex-col items-center gap-1'>
          <p>Eye Glasses</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/>
        </NavLink>
        <NavLink to='/sunglasses' className='flex flex-col items-center gap-1'>
          <p>Sun Glasses</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/>
        </NavLink>
        <NavLink to='/lens' className='flex flex-col items-center gap-1'>
          <p>Lenses</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/>
        </NavLink>
        <NavLink to='/accessories' className='flex flex-col items-center gap-1'>
          <p>Accessorise</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/>
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>About</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/>
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <div className='group relative'>
          <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="Profile" />
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <Link to='/myprofile' className='cursor-pointer hover:text-black'>My Profile</Link>
              <Link to='/myorders' className='cursor-pointer hover:text-black'>My Orders</Link>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
          {/* Hiển thị số lượng sản phẩm trong giỏ hàng */}
          {totalItemsInCart > 0 && (
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
              {totalItemsInCart}
            </p>
          )}
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu" />
      </div>

      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        {/* Nội dung menu điều hướng có thể được thêm ở đây nếu cần */}
      </div>
    </div>
  );
};

export default Navbar;
