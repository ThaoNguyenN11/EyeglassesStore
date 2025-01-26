import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
const Products = () => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/product/activeProduct"
        );
        console.log("API Response:", response.data); // Debug
        const productList = Array.isArray(response.data.data)
          ? response.data.data
          : []; // Đảm bảo đây là mảng
        setProducts(productList);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (productID) => {  
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/api/product/remove/${productID}`, {
        method: 'PATCH',  
      });
  
      const data = await response.json();
      if (data.success) {
        
        setProducts(products.filter((product) => product.productID !== productID));  // Dùng productID đúng
      } else {
        alert('Failed to delete product: ' + data.message);
      }
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };
  
  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
        <Link to="/add">
          <button className="flex items-center p-2 bg-blue-500 text-white rounded">
            <FaPlus className="h-5 w-5 mr-2" /> ADD
          </button>
        </Link>
      </div>

      {/* Product Table */}
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ProductID</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Subcategory</th>
            <th className="border border-gray-300 px-4 py-2">Colors</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                {product.productID}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.productName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ${product.price}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {product.category}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {product.subCategory}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {product.color ? product.color.join(", ") : "N/A"}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <button className="text-yellow-500 mx-2">
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 mx-2"
                  onClick={() => handleDelete(product.productID)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;
