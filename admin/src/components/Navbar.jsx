import React from 'react';
import { assets } from '../assets/assets';

const Navbar = () => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[50%] max-w-[100px] h-auto' src={assets.logo} alt="Logo" />
        <button className='bg-gray-600 text-white px-5 py-3 sm:px-7 rounded-full'>Logout</button>
    </div>
  );
}

export default Navbar;
