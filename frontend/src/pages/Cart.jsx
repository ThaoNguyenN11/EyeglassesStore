import React, { useContext } from "react";
import Title from "../components/Title";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading } = useContext(CartContext);
  console.log("Cart Data at cart.jsx:", cart);

  if (loading) {
    return <div className="text-gray-600">Loading cart...</div>;
  }

  const cartItems = Array.isArray(cart) ? cart : [];

  // Tính tổng giá tiền
  const totalPrice = cartItems.reduce((total, item) => {
    const product = item.productDetails;
    if (!product) return total;

    const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
    return total + price * item.quantity;
  }, 0);

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
            {cartItems.map((item) => {
              if (!item.productDetails) return null;
              
              const product = item.productDetails;
              const imageUrl = product.selectedVariation?.imageUrls?.[0] || "/default-image.jpg";
              const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;

              return (
                <div key={product.productID + item.color} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                  {/* Product Image with Overlay */}
                  <Link to={`/product/${product.productID}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.productName || "Product Image"}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => removeFromCart(product.productID, item.color)}
                        className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  </Link>
                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-medium text-gray-800 line-clamp-2">{product.productName || "Unnamed Product"}</h2>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between">
                        <p className="text-gray-500 text-sm">Price:</p>
                        <p className="font-medium text-gray-800">{price} VND</p>
                      </div>
                      
                      <div className="flex justify-between">
                        <p className="text-gray-500 text-sm">Color:</p>
                        <div className="flex items-center">
                          <span 
                            className="inline-block h-4 w-4 rounded-full mr-1 border border-gray-300" 
                            style={{backgroundColor: item.color.toLowerCase()}}
                          ></span>
                          <span className="text-gray-800">{item.color}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 my-2">
                      <span className="text-sm font-medium text-gray-600">Quantity:</span>
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => item.quantity > 1 && updateQuantity(product.productID, item.color, item.quantity - 1)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQuantity(product.productID, item.color, item.quantity + 1)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Total Price */}
                    <div className="mt-auto pt-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">Total:</p>
                        <p className="text-lg font-semibold text-gray-900">{(price * item.quantity)} VND</p>
                      </div>
                      
                      <button
                        className="w-full mt-3 bg-[#FF2613] hover:bg-[#e02010] text-white py-2 rounded-md font-medium transition-colors duration-300 flex items-center justify-center"
                        onClick={() => removeFromCart(product.productID, item.color)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove from Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-lg font-bold">Total Price: {totalPrice} VND</div>

          <Link to="/placeorder">
            <button className="mt-4 bg-[#12315F] text-white py-2 px-4 rounded">Proceed to Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
