import React, { useContext, useState } from "react";
import Title from "../components/Title";
import { CartContext } from "../context/CartContext.jsx";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { createOrder } from "../hooks/orderService";
import { AuthContext } from "../context/AuthContext";

const PlaceOrder = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Add this line to get user from AuthContext
  // Logging để debug
  console.log("Cart in PlaceOrder:", cart);
  const itemsTotal = getTotalPrice();
  console.log("Items total:", itemsTotal);
  const [isCODChecked, setIsCODChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    district: "",
    city: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const shippingFee = 10;
  console.log("Cart items:", cart); // Debug cart items
  console.log("Total price:", itemsTotal); // Debug total price
  const { currency } = useContext(ShopContext);
  const total = itemsTotal + shippingFee;
  const navigate = useNavigate();
  // Add this to your component's state
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Default to 'cod'

  // Then update your form validation and submission logic to use this value

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({
      ...errors,
      [name]: value.trim() === "" ? "This field is required" : "",
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login to place order");
      return;
    }

    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        newErrors[key] = "This field is required";
      }
    });

    if (!paymentMethod) {
      newErrors["paymentMethod"] = "Please select a payment method";
    }

    setErrors(newErrors);

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      const orderData = {
        userID: user.userID, 
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: `${formData.street}, ${formData.district}`, 
          city: formData.city, 
          phone: formData.phoneNumber
        },
        paymentMethod,
        items: cart.map((item) => ({
          productID: typeof item.productID === "object" ? item.productID._id : item.productID,
          quantity: item.quantity,
          color: item.color,
          price: item.productDetails.discountedPrice || item.productDetails.price,         })),
      };

      console.log("Submitting order with cart items:", cart);
      console.log("Final order payload:", orderData);

      try {
        if (paymentMethod === "momo") {
          const res = await fetch("http://localhost:4000/api/payment/momo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderInfo: orderData,
              amount: total * 1000, // Momo yêu cầu số tiền tính bằng đồng
            })
          });
  
          const momoRes = await res.json();
          console.log("MoMo Response:", momoRes);
          if (momoRes.data.payUrl) {
            window.location.href = momoRes.data.payUrl; // chuyển hướng sang Momo
          } else {
            alert("Failed to initiate Momo payment");
          }
        } else {
          // 🧾 Xử lý như cũ với COD
          const createdOrder = await createOrder(orderData);
          await clearCart();
          navigate("/order", { state: { order: createdOrder.order } });
        }
      } catch (error) {
        console.error("Order creation error:", error);
        alert(error.message || "Failed to place order");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between gap-8 pt-5 lg:pt-10 min-h-[80vh] border-t border-gray-200">
        {/* Left Column - Delivery Information */}
        <div className="flex flex-col gap-6 w-full lg:w-3/5">
          <div className="mb-4">
            <Title text1="Delivery" text2="Information" />
            <p className="text-gray-500 mt-2">
              Please enter your delivery details below
            </p>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-lg mb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phoneNumber"
                className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="text"
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-lg mb-4">Shipping Address</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                name="street"
                className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="text"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
              />
              {errors.street && (
                <p className="text-red-500 text-sm mt-1">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  name="district"
                  className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="text"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleChange}
                />
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  className="border border-gray-300 rounded-md py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-8">
            <h3 className="font-medium text-xl mb-6">Order Summary</h3>

            <div className="space-y-2 pb-4 mb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <p className="text-gray-600">Sub Total:</p>
                <p className="font-medium">
                  {itemsTotal} {currency}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Delivery Fee:</p>
                <p className="font-medium">
                  {shippingFee} {currency}
                </p>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg mb-8">
              <p>Total Amount:</p>
              <p>
                {total} {currency}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">
                Payment Method <span className="text-red-500">*</span>
              </p>

              <div className="space-y-3">
                <div
                  className={`flex items-center gap-3 border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition ${
                    paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <input
                    type="radio"
                    className="w-4 h-4 accent-blue-600"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    name="paymentMethod"
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </div>

                <div
                  className={`flex items-center gap-3 border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition ${
                    paymentMethod === "momo" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setPaymentMethod("momo")}
                >
                  <input
                    type="radio"
                    className="w-4 h-4 accent-blue-600"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    name="paymentMethod"
                  />
                  <span className="font-medium">Pay with Momo</span>
                </div>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
            
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#12315F] text-white py-3 rounded-md font-medium text-lg hover:bg-[#0a1f3d] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Place Order
            </button>
            

            <p className="text-center text-gray-500 text-sm mt-4">
              By placing your order, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;


