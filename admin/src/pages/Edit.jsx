import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getSingleProduct, editProduct } from "../services/productService";

const EditProduct = ({ updateProduct }) => {
  const { productID } = useParams();
  const [product, setProduct] = useState({
    productName: "",
    description: "",
    category: "glassesframe",
    price: "",
    bestSeller: false,
    material: "Plastic",
    dimensions: { width: "", lensWidth: "", lensHeight: "", bridge: "" },
    variations: [],
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [imagesByColor, setImagesByColor] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product:", productID);
        const response = await getSingleProduct(productID);
        console.log("Response:", response.data);

        const data = response.data;
        setProduct({
          productName: data.productName || "",
          description: data.description || "",
          category: data.category || "glassesframe",
          price: data.price || "",
          bestSeller: data.bestSeller || false,
          material: data.material || "Plastic",
          dimensions:
            data.dimensions === "string"
              ? JSON.parse(data.dimensions)
              : { width: "", lensWidth: "", lensHeight: "", bridge: "" },
          variations: data.variations || [],
        });

        // Initialize imagesByColor state
        const initialImagesByColor = {};
        data.variations.forEach((variations) => {
          initialImagesByColor[variations.color] = {
            existingImages: variations.imageUrls || [],
            newImages: [],
          };
        });
        setImagesByColor(initialImagesByColor);

        // Set initial selected color
        if (data.variations.length > 0) {
          setSelectedColor(data.variations[0].color);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response) {
          console.error("Error Response:", error.response.data);
        }
      }
    };

    fetchProduct();
  }, [productID]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDimensionChange = (e) => {
    setProduct({
      ...product,
      dimensions: { ...product.dimensions, [e.target.name]: e.target.value },
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagesByColor((prev) => ({
      ...prev,
      [selectedColor]: {
        existingImages: prev[selectedColor]?.existingImages || [],
        newImages: [...(prev[selectedColor]?.newImages || []), ...files],
        newImagePreviews: [
          ...(prev[selectedColor]?.newImagePreviews || []),
          ...filePreviews,
        ],
      },
    }));

    // Add new color variation if it doesn't exist
    if (!product.variations.some((v) => v.color === selectedColor)) {
      setProduct((prev) => ({
        ...prev,
        variations: [
          ...prev.variations,
          { color: selectedColor, imageUrls: [] },
        ],
      }));
    }
  };

  const handleRemoveImage = (color, index, isExisting = false) => {
    setImagesByColor((prevImages) => {
      const updatedImages = { ...prevImages };
      if (isExisting) {
        updatedImages[color].existingImages = updatedImages[
          color
        ].existingImages.filter((_, i) => i !== index);
      } else {
        updatedImages[color].newImages = updatedImages[color].newImages.filter(
          (_, i) => i !== index
        );
        updatedImages[color].newImagePreviews = updatedImages[
          color
        ].newImagePreviews.filter((_, i) => i !== index);
      }
      return updatedImages;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("price", product.price);
      formData.append("bestSeller", product.bestSeller);
      formData.append("material", product.material);
      formData.append("dimensions", JSON.stringify(product.dimensions));
      formData.append("variations", JSON.stringify(product.variations));

      // Append images by color
      Object.keys(imagesByColor).forEach((color) => {
        imagesByColor[color].newImages.forEach((image) => {
          formData.append(`files_${color}`, image);
        });
      });

      const response = await axios.patch(
        `http://localhost:4000/api/product/edit/${productID}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setMessage({ text: "Product updated successfully!", type: "success" });
      } else {
        setMessage({
          text: response.data.message || "Failed to update product.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occurred while updating the product.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Orange",
    "Pink",
    "Purple",
    "Clear",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
        Edit Product
      </h2>

      {message.text && (
        <div
          className={`p-3 rounded-md text-white ${
            message.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name
        </label>
        <input
          className="w-full px-4 py-3 border rounded-md"
          type="text"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="w-full px-4 py-3 border rounded-md"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price ($)
        </label>
        <input
          className="w-full px-4 py-3 border rounded-md"
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          name="category"
          className="w-full px-4 py-3 border rounded-md"
          value={product.category}
          onChange={handleChange}
        >
          <option value="glassesframe">Glasses Frame</option>
          <option value="sunglasses">Sunglasses</option>
          <option value="lenses">Lenses</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Bestseller */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="bestSeller"
          checked={product.bestSeller}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm font-medium text-gray-700">
          Bestseller
        </label>
      </div>

      {/* Material */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material
        </label>
        <select
          name="material"
          className="w-full px-4 py-3 border rounded-md"
          value={product.material}
          onChange={handleChange}
        >
          <option value="Plastic">Plastic</option>
          <option value="Titanium">Titanium</option>
          <option value="Aluminum">Aluminum</option>
          <option value="Stainless steel">Stainless Steel</option>
          <option value="Monel">Monel</option>
        </select>
      </div>

      {/* Product Colors Selection */}
      <div className="col-span-2 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Product Colors
        </label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`px-4 py-2 rounded-md transition-all ${
                selectedColor === color
                  ? "bg-blue-500 text-white shadow-md" // Màu được chọn: xanh đậm
                  : product.variations.some((v) => v.color === color)
                  ? "bg-blue-100 text-gray-700" // Màu có trong danh sách variations: xanh nhạt
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Images for Selected Color */}
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

          {/* Display Existing Images for this Color */}
          {imagesByColor[selectedColor]?.existingImages?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Existing Images
              </h3>
              <div className="flex flex-wrap gap-4">
                {imagesByColor[selectedColor].existingImages.map(
                  (imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${selectedColor} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        onClick={() =>
                          handleRemoveImage(selectedColor, index, true)
                        }
                      >
                        &times;
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Display New Images for this Color */}
          {imagesByColor[selectedColor]?.newImagePreviews?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                New Images
              </h3>
              <div className="flex flex-wrap gap-4">
                {imagesByColor[selectedColor].newImagePreviews.map(
                  (previewUrl, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={previewUrl}
                        alt={`New ${selectedColor} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        onClick={() => handleRemoveImage(selectedColor, index)}
                      >
                        &times;
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default EditProduct;
