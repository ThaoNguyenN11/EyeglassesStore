import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext"; // Import CartContext
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productID } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {user} = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
    const { currency } = useContext(ShopContext); 

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/product/single/${productID}`
        );

        if (response.data.success && response.data.data) {
          setProductData(response.data.data);

          if (response.data.data.variations.length > 0) {
            setSelectedColor(response.data.data.variations[0].color);
            setSelectedImage(response.data.data.variations[0].imageUrls[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [productID]);

  const handleColorSelect = (colorOption, imageUrls) => {
    setSelectedColor(colorOption);
    setSelectedImage(imageUrls[0]); 
  };

  const handleAddToCart = async () => {    
    if (!user) {
      setMessage("Please log in to add items to your cart.");
      return;
    }

    if (!selectedColor) {
      setMessage("Please select a color.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/cart/add", {
        userID: user.userID, // Thay bằng userID thực tế từ context hoặc localStorage
        productID: productID,
        quantity: quantity,
        color: selectedColor
      });

      if (response.data.success) {
        setMessage("Added to cart successfully!");
        fetchCart();
      } else {
        setMessage("Failed to add to cart.");
      }
    } catch (error) {
      setMessage("An error occurred while adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  if (!productData) return <div>Loading...</div>;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.variations.map((variation, index) =>
              variation.imageUrls.map((image, imgIndex) => (
                <img
                  key={`${index}-${imgIndex}`}
                  className={`w-16 h-16 cursor-pointer border ${
                    selectedImage === image ? "border-orange-500" : ""
                  }`}
                  src={image}
                  alt={`product thumbnail ${index}`}
                  onClick={() => setSelectedImage(image)}
                />
              ))
            )}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={selectedImage} alt={productData.productName} />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.productName}</h1>
          <p className="text-gray-500 mt-2">Product ID: {productData.productID}</p>

          <p className="mt-5 text-3xl font-medium">
            {productData.discountedPrice
              ? productData.discountedPrice
              : productData.price}{" "}
            {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Chọn màu */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Color:</p>
            <div className="flex gap-2">
              {productData.variations.length > 0 ? (
                productData.variations.map((variation, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(variation.color, variation.imageUrls)}
                    className={`border py-2 px-4 bg-gray-100 ${
                      selectedColor === variation.color ? "border-orange-500" : ""
                    }`}
                  >
                    {variation.color}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No colors available</p>
              )}
            </div>
          </div>

          {/* Chọn số lượng */}
          <div className="flex gap-4 items-center my-4">
            <p>Quantity:</p>
            <button 
              className="border px-3 py-1" 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >-</button>
            <span className="px-3">{quantity}</span>
            <button 
              className="border px-3 py-1" 
              onClick={() => setQuantity(prev => prev + 1)}
            >+</button>
          </div>

          {/* Thêm vào giỏ hàng */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          {/* Hiển thị thông báo */}
          {message && <p className="mt-3 text-red-500">{message}</p>}

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Cash on Delivery</p>
            <p>Exchange and Cashback</p>
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{productData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
