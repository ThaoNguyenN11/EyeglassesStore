import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Routes, Route} from 'react-router-dom'
import Add from './pages/Add'
import Orders from './pages/Orders'
import List from './pages/List'
import Login from './components/Login'
import Products from './pages/Products'
import Dashboard from './pages/Dashboard'
import Customer from './pages/Customer'
import Promote from './pages/Promote'
import Warehouse from './pages/Warehouse'

const App = () => {

  const[token, setToken] = useState ('212');
  return (
    <div className='bg-gray-50 min-h-screen'>
      {token === ""
      ? <Login/>
      :<>
      <Navbar/>
      <hr />
      
      <div className='flex w-full'>
          <Sidebar/>
          <div className='w-[70%] mx-auto ml-max[(5vw, 25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/product' element={< Products/>} />
            <Route path='/add' element={< Add/>} />
            <Route path='/customer' element={<Customer/>} />
            <Route path='/orders' element={<Orders/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/promote' element={<Promote/>} />
            <Route path='/warehouse' element={<Warehouse/>} />
          </Routes>
          </div>
      </div>
    </>
      }
      
    </div>
  )
}

export default App
