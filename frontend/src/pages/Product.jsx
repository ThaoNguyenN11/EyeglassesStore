import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShopContext } from "../context/ShopContext";
import Webcam from "../components/WebCam.jsx";

const Product = () => {
  const { productID } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const { currency } = useContext(ShopContext);

  // Try-on functionality
  const [showTryGlassesModal, setShowTryGlassesModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

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
        userID: user.userID,
        productID: productID,
        quantity: quantity,
        color: selectedColor,
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

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setIsCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCamera = () => {
    setIsCameraActive(true);
    setCameraError("");
  };

  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setUploadedImage(screenshot);
        setIsCameraActive(false);
      } else {
        setCameraError("Failed to capture photo. Please try again.");
      }
    }
  };

  const handleRetakePhoto = () => {
    setUploadedImage(null);
    setIsCameraActive(true);
  };

  const handleCloseModal = () => {
    setShowTryGlassesModal(false);
    setUploadedImage(null);
    setIsCameraActive(false);
  };

  if (!productData) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const showTryButton = ["glassesframe", "sunglasses"].includes(
    productData.category?.toLowerCase()
  );

  return (
    <div className="border-t-2 pt-10 max-w-7xl mx-auto px-4">
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-2 sm:justify-normal sm:w-[18.7%] w-full max-h-[500px]">
            {productData.variations.map((variation, index) =>
              variation.imageUrls.map((image, imgIndex) => (
                <img
                  key={`${index}-${imgIndex}`}
                  className={`w-16 h-16 cursor-pointer border object-cover ${
                    selectedImage === image ? "border-orange-500" : "border-gray-200 hover:border-gray-400"
                  }`}
                  src={image}
                  alt={`${productData.productName} - ${variation.color}`}
                  onClick={() => setSelectedImage(image)}
                />
              ))
            )}
          </div>
          <div className="w-full sm:w-[80%]">
            <img 
              className="w-full h-auto object-contain max-h-[500px]" 
              src={selectedImage} 
              alt={productData.productName} 
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.productName}</h1>
          <p className="text-gray-500 mt-2">Product ID: {productData.productID}</p>

          <p className="mt-5 text-3xl font-medium">
            {productData.discountedPrice || productData.price} {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Color:</p>
            <div className="flex flex-wrap gap-2">
              {productData.variations.length > 0 ? (
                productData.variations.map((variation, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(variation.color, variation.imageUrls)}
                    className={`border py-2 px-4 bg-gray-50 rounded hover:bg-gray-100 transition ${
                      selectedColor === variation.color ? "border-orange-500 font-medium" : "border-gray-200"
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

          <div className="flex gap-4 items-center my-4">
            <p className="font-medium">Quantity:</p>
            <button
              className="border rounded-md px-3 py-1 hover:bg-gray-100"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="px-3 font-medium">{quantity}</span>
            <button 
              className="border rounded-md px-3 py-1 hover:bg-gray-100" 
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>

            {showTryButton && (
              <button
                onClick={() => setShowTryGlassesModal(true)}
                className="bg-blue-600 text-white px-6 py-3 text-sm rounded-md hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Try Glasses
              </button>
            )}
          </div>

          {message && (
            <div className={`mt-3 py-2 px-3 rounded ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <p>Cash on Delivery</p>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
              <p>Exchange and Cashback</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex border-b">
          <div className="border-b-2 border-black px-5 py-3 text-sm font-medium">Description</div>
        </div>
        <div className="py-6 text-sm text-gray-700 leading-relaxed">
          <p>{productData.description}</p>
        </div>
      </div>

      {/* Glasses Try-On Modal */}
      {showTryGlassesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Virtual Glasses Try-On</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Glasses Try-On Guide
                </h3>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                  <li>For the best try-on results, please take a front-facing photo of your face.</li>
                  <li>Take the photo in a well-lit environment and avoid backlight glare.</li>
                  <li>Do not wear glasses while taking the photo and ensure your face is unobstructed.</li>
                  <li>Position the camera at eye level and keep your head straight while taking the photo.</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border rounded-md p-4">
                  <h3 className="font-medium mb-3">1. Choose or take your photo</h3>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600">Upload an image:</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleUploadImage}
                        className="border rounded p-2 text-sm" 
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm px-2">or</span>
                      <hr className="flex-grow" />
                    </div>

                    {!isCameraActive ? (
                      <button
                        onClick={handleOpenCamera}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Use Camera
                      </button>
                    ) : null}
                    
                    {cameraError && (
                      <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                        {cameraError}
                      </div>
                    )}
                    
                    {isCameraActive && (
                      <div className="mt-1">
                        <div className="relative bg-black rounded-md overflow-hidden">
                          {/* Using custom Webcam component instead of video element */}
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                              width: 480,
                              height: 360,
                              facingMode: "user"
                            }}
                            mirrored={true}
                            onUserMediaError={(err) => {
                              setCameraError("Could not access camera: " + err.toString());
                              setIsCameraActive(false);
                            }}
                            className="w-full h-auto rounded-md"
                            style={{ display: isCameraActive ? "block" : "none" }}
                          />
                          <div className="absolute inset-x-0 bottom-3 flex justify-center">
                            <button
                              onClick={handleTakePhoto}
                              className="bg-red-600 text-white py-2 px-6 rounded-full shadow hover:bg-red-700 transition"
                            >
                              Take Photo
                            </button>
                          </div>
                        </div>
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        
                        <div className="mt-2 flex justify-center">
                          <button
                            onClick={() => {
                              setIsCameraActive(false);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel Photo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 border rounded-md p-4">
                  <h3 className="font-medium mb-3">2. Preview the result</h3>

                  {uploadedImage ? (
                    <div className="space-y-3">
                      <div className="relative border rounded-md overflow-hidden aspect-[3/4] flex items-center justify-center bg-white">
                        <img 
                          src={uploadedImage} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain" 
                        />
                      </div>
                      
                      {uploadedImage && (
                        <button
                          onClick={handleRetakePhoto}
                          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition w-full flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Retake Photo
                        </button>
                      )}
                      
                      <p className="text-xs text-gray-500 italic">
                        * This is a simple simulation, actual results may vary.
                      </p>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-100 border rounded-md">
                      <p className="text-gray-500 text-center px-4">
                        Take a photo or upload an image to preview the glasses try-on result.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;