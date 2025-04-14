import React, { useState } from "react";
import axios from "axios";

const Add = ({ addProduct }) => {
  const [imagesByColor, setImagesByColor] = useState({});
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("glassesframe");
  const [productPrice, setProductPrice] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [material, setMaterial] = useState("Plastic");
  const [dimensions, setDimensions] = useState({
    width: "",
    lensWidth: "",
    lensHeight: "",
    bridge: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleImageChange = (event) => {
    const fileList = Array.from(event.target.files);
    setImagesByColor((prevImages) => ({
      ...prevImages,
      [selectedColor]: [...(prevImages[selectedColor] || []), ...fileList],
    }));
  };

  const handleRemoveImage = (color, index) => {
    setImagesByColor((prevImages) => ({
      ...prevImages,
      [color]: prevImages[color].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // Prepare the form data
      const formData = new FormData();

      // Add product details
      formData.append("productName", productName);
      formData.append("category", productCategory);
      formData.append("material", material);
      formData.append("price", productPrice);
      formData.append("description", productDescription);
      formData.append("bestSeller", bestseller);

      // Add dimensions
      formData.append("dimensions", JSON.stringify(dimensions));

      // Process variations
      const variations = Object.keys(imagesByColor).map((color) => ({
        color,
      }));
      formData.append("variations", JSON.stringify(variations));

      // Add all images by color
      Object.entries(imagesByColor).forEach(([color, images]) => {
        images.forEach((image) => {
          formData.append(`files_${color}`, image);
        });
      });

      // Validate required fields
      if (
        !productName ||
        !productCategory ||
        !productPrice ||
        Object.keys(imagesByColor).length === 0
      ) {
        setMessage({
          text: "Please fill in all required fields and upload at least one image.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }
      console.log("FormData:", [...formData]);
      // Send the data to the backend
      const response = await axios.post(
        "http://localhost:4000/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage({ text: "Product added successfully!", type: "success" });
        resetForm();
      } else {
        setMessage({
          text: response.data.message || "Failed to add product.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occurred while adding the product.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductCategory("glassesframe");
    setProductPrice("");
    setImagesByColor({});
    setSelectedColor("");
    setBestseller(false);
    setMaterial("Plastic");
    setDimensions({ width: "", lensWidth: "", lensHeight: "", bridge: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
        Add New Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="product-name"
          >
            Product Name
          </label>
          <input
            id="product-name"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        {/* Product Description */}
        <div className="col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-32"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Describe the product"
          />
        </div>

        {/* Category */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="product-category"
          >
            Category
          </label>
          <select
            id="product-category"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          >
            <option value="glassesframe">Glasses Frame</option>
            <option value="sunglasses">Sun Glasses</option>
            <option value="lens">Lens</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Material */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="product-material"
          >
            Material
          </label>
          <select
            id="product-material"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="Plastic">Plastic</option>
            <option value="Titaninum">Titanium</option>
            <option value="Aluminum">Aluminum</option>
            <option value="Stainless steel">Stainless Steel</option>
            <option value="Monel">Monel</option>
          </select>
        </div>

        {/* Sale Price */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="product-price"
          >
            Sale Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              $
            </span>
            <input
              id="product-price"
              className="w-full pl-8 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              type="number"
              placeholder="Price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center h-5">
            <input
              id="bestseller"
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
            />
          </div>
          <label
            htmlFor="bestseller"
            className="text-sm font-medium text-gray-700"
          >
            Bestseller
          </label>
        </div>
      </div>

      {/* Product Colors */}
      <div className="col-span-2 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Product Colors
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            "Red",
            "Blue",
            "Green",
            "Black",
            "White",
            "Orange",
            "Pink",
            "Purple",
            "Clear",
          ].map((color) => (
            <button
              key={color}
              type="button"
              className={`px-4 py-2 rounded-md transition-all ${
                selectedColor === color
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      {selectedColor && (
        <div className="col-span-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload images for {selectedColor}
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-3 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {(imagesByColor[selectedColor] || []).map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(selectedColor, index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Dimensions */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Product Dimensions
        </label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1" htmlFor="width">
              Width
            </label>
            <input
              id="width"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
            />
          </div>
          <div>
            <label
              className="block text-xs text-gray-500 mb-1"
              htmlFor="lens-width"
            >
              Lens Width
            </label>
            <input
              id="lens-width"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              type="number"
              placeholder="Lens Width"
              value={dimensions.lensWidth}
              onChange={(e) =>
                setDimensions({ ...dimensions, lensWidth: e.target.value })
              }
            />
          </div>
          <div>
            <label
              className="block text-xs text-gray-500 mb-1"
              htmlFor="lens-height"
            >
              Lens Height
            </label>
            <input
              id="lens-height"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              type="number"
              placeholder="Lens Height"
              value={dimensions.lensHeight}
              onChange={(e) =>
                setDimensions({ ...dimensions, lensHeight: e.target.value })
              }
            />
          </div>
          <div>
            <label
              className="block text-xs text-gray-500 mb-1"
              htmlFor="bridge"
            >
              Bridge
            </label>
            <input
              id="bridge"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              type="number"
              placeholder="Bridge"
              value={dimensions.bridge}
              onChange={(e) =>
                setDimensions({ ...dimensions, bridge: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          type="submit"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default Add;
