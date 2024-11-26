import React, { useContext } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, getTotalPrice, removeFromCart, updateQuantity } = useContext(ShopContext);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="Your" text2="Cart" />
      </div>
      {cartItems.length === 0 ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartItems.map((item) => (
              <div key={item._id + item.color} className="border rounded p-4 flex flex-col">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">Price: {item.price} {item.currency}</p>
                
                {/* Hiển thị thông tin màu sắc */}
                <p className="text-gray-500">Color: {item.color}</p>

                {/* Tùy chỉnh số lượng */}
                <div className="flex items-center mt-2">
                  <button 
                    className="border px-2 py-1"
                    onClick={() => item.quantity > 1 && updateQuantity(item._id, item.color, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button 
                    className="border px-2 py-1"
                    onClick={() => updateQuantity(item._id, item.color, item.quantity + 1)} // Tăng thêm 1 số lượng
                  >
                    +
                  </button>
                </div>

                <p className="text-gray-500">Total: {item.price * item.quantity} {item.currency}</p>
                <button 
                  className="mt-auto bg-[#FF2613] text-white py-2 rounded" 
                  onClick={() => removeFromCart(item._id, item.color)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 text-lg font-bold">
            Total Price: {getTotalPrice()} {cartItems.length > 0 ? cartItems[0].currency : ""}
          </div>
          <Link to='/placeorder'>
            <button className="mt-4 bg-[#12315F] text-white py-2 px-4 rounded">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
