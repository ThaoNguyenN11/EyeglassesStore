import React from 'react'

const Login = () => {

  const[currentSate, setCurrentState] = useState('Login');
  return (
    <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 '>
    <div className='inline-flex items-center gap-2 mb-2 mt10'>
      <p className='tetx-3xl'>{currentSate}</p>
      <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
    </div>
    <input className='w-full px-3 py-2 border border-gray-800'type="text" placeholder='username' required />
    <input className='w-full px-3 py-2 border border-gray-800'type="text" placeholder='password' required/>
   </form>
  )
}

export default Login
