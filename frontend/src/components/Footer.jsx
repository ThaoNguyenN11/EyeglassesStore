import React from 'react'
import { assets } from '../assets/assets'
const Footer = () => {
  return (
    <div>
    <div className='flex felx-cols sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        
           <div className='flex items-center justify-center'>
            <img src={assets.logo1} className='mb-5 w-32' alt="" />
            
            <div className='w-full md:w-2/3 text-gray-600'>Elevate your eyewear game today!</div>

           </div>

           <div>
                <p className='text-xl font-medium mb-5'>Eyewear</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Email</li>
                    <li>Hotline</li>
                    <li>Time-date</li>
                </ul>

           </div>
           <div>
                <p className='text-xl font-medium mb-5'>Eyewear</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Email</li>
                    <li>Hotline</li>
                    <li>Time-date</li>
                </ul>

           </div>
           </div>

           <div>
            <hr />
            <p className='py-5 text-sm text-center'>Đại diện pháp luật: Nguyễn Tiến Dũng. Ngày cấp giấy phép: 14/08/2019. Ngày hoạt động: 14/08/2019</p>
           </div>
      
    
    </div>
  )
}

export default Footer
