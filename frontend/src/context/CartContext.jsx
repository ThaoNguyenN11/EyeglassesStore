import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/cart/${user.userID}`
      );
      setCart(res.data.cart.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productID, quantity, color) => {
    if (!user) return alert("Login to add to cart!");
    try {
      const res = await axios.post("http://localhost:4000/api/cart/add", {
        userID: user.userID,
        productID,
        quantity,
        color,
      });

      if (res.data.success) {
        setCart((prevCart) => {
          const existingItem = prevCart.find(
            (item) => item.productID === productID && item.color === color
          );
          if (existingItem) {
            return prevCart.map((item) =>
              item.productID === productID && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prevCart, { productID, color, quantity }];
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
    }
  };

  const updateQuantity = async (productID, color, quantity) => {
    if (!user) return;
    try {
      const res = await axios.patch("http://localhost:4000/api/cart/update", {
        userID: user.userID,
        productID,
        color,
        quantity,
      });

      if (res.data.success) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.productID === productID && item.color === color
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = async (productID, color) => {
    if (!user) return;
    try {
      const res = await axios.delete("http://localhost:4000/api/cart/remove", {
        data: { userID: user.userID, productID, color },
      });

      if (res.data.success) {
        setCart((prevCart) =>
          prevCart.filter(
            (item) => !(item.productID === productID && item.color === color)
          )
        );
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart =  () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    if (!cart || cart.length === 0) return 0;

    return cart.reduce((total, item) => {
      // Sử dụng productDetails giống như trong Cart.jsx
      const product = item.productDetails;
      if (!product) return total;

      const price =
        product.discountedPrice > 0 ? product.discountedPrice : product.price;

      console.log("Item price calculation:", {
        product: product,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
      });

      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
