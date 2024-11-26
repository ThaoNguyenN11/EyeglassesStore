import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[141414]'></p>
                    <p className='font-medium text-sm md:text-base'> BEST SELLER</p>
                </div>
                <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrival</h1>
                <div className='flex item-center gap-2'>
                    <p className='fomt-semibold text-sm md:text-base'>Shop now</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#141414]'></p>
                </div>
            </div>
        </div>
        <img src={assets.hero_img} className='w-full sm:w-1/2' alt="" />
      
    </div>
  )
}

export default Hero
