import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Eyeglasses from './pages/Eyeglasses'
import About from './pages/About'
import Sunglasses from './pages/Sunglasses'
import Lens from './pages/Lens'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import Accessories from './pages/Accessories'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Footer from './components/Footer'
import Search from './components/Search'
import MyProfile from './pages/MyProfile'
import MyOrders from './pages/MyOrders'
import Signup from './pages/Signup'
import SearchResults from './pages/SearchResult'
import PaymentResult from './pages/PaymentResult'

const App = () => {
  return (
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar/>
      <Search/>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/eyeglasses' element={<Eyeglasses/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/sunglasses' element={<Sunglasses />}/>
        <Route path='/lens' element={<Lens/>} />
        <Route path='/accessories' element={<Accessories/>} />
        <Route path='/product/:productID' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/placeorder' element={<PlaceOrder/>} />
        <Route path='/order' element={<Order/>} />
        <Route path='/myprofile' element={<MyProfile/>} />
        <Route path='/myorders' element={<MyOrders/>} />
        <Route path='/search' element={<SearchResults/>}/>
        <Route path='/payment-result' element={<PaymentResult/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
