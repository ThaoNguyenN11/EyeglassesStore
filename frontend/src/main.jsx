import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <BrowserRouter>
  <ShopContextProvider>
  <CartProvider>
  <App/>
  </CartProvider>
  </ShopContextProvider>
  </BrowserRouter>,
  </AuthProvider>
)
