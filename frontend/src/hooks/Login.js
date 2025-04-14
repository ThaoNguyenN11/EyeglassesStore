import React, { useState } from 'react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        credentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token); // Lưu token vào localStorage
        setMessage('Login successful');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      <input 
        className='w-full px-3 py-2 border border-gray-800' 
        type="email" 
        placeholder='Email' 
        required 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        className='w-full px-3 py-2 border border-gray-800' 
        type="password" 
        placeholder='Password' 
        required 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className='w-full bg-gray-800 text-white py-2'>Login</button>
      {message && <p className='text-red-500'>{message}</p>}
    </form>
  );
};

export default Login;
