import React, { createContext, useState } from "react";
import { products } from "../assets/assets"; 

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VND";
  const delivery_fee = 10;

  const [cartItems, setCartItems] = useState([]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) + delivery_fee; // Cộng phí giao hàng vào tổng
  };

  const addToCart = (id, color) => {
    const existingItem = cartItems.find(item => item._id === id && item.color === color);
    
    if (existingItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ, tăng số lượng
      setCartItems(cartItems.map(item =>
        item._id === id && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ hàng
      const productToAdd = products.find(item => item._id === id);
      const newItem = {
        ...productToAdd,
        color: color,
        quantity: 1, // Mặc định là 1
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (id, color, newQuantity) => {
    setCartItems(cartItems.map(item => {
      if (item._id === id && item.color === color) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id, color) => {
    const updatedCartItems = cartItems.filter(item => !(item._id === id && item.color === color));
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]); 
  };

  const value = {
    products,
    cartItems,
    getTotalPrice,
    currency,
    delivery_fee,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart, 
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
