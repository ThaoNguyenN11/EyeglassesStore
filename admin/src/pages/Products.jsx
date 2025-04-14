import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getActiveProducts, removeProduct } from "../services/productService"; // Đảm bảo đúng import

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productList = await getActiveProducts();
      setProducts(productList);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (productID) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const result = await removeProduct(productID);
    if (result.success) {
      setProducts(
        products.filter((product) => product.productID !== productID)
      );
    } else {
      alert("Failed to delete product: " + result.message);
    }
  };

  const handleEdit = (productID) => {
    console.log(`Edit product with ID: ${productID}`);
    // Điều hướng đến trang chỉnh sửa
    window.location.href = `/edit/${productID}`;
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <div>
        <Link to="/add">
          <button className="mb-6 bg-blue-500 text-white py-2 px-4 rounded flex items-center">
            <FaPlus className="mr-2" /> Add Product
          </button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Product List</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Color</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Sold</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">
                Discounted Price
              </th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) =>
              product.variations.map((variation, index) => (
                <tr
                  key={`${product.productID}-${variation.color || "no-color"}`}
                  className="hover:bg-gray-100"
                >
                  {index === 0 && (
                    <td
                      rowSpan={product.variations.length}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {product.productID}
                    </td>
                  )}
                  {index === 0 && (
                    <td
                      rowSpan={product.variations.length}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {product.productName}
                    </td>
                  )}
                  <td className="border border-gray-300 px-4 py-2">
                    {variation.color}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variation.imageUrls.length > 0 ? (
                      <img
                        src={variation.imageUrls[0]}
                        alt={variation.color}
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variation.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variation.soldQuantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${product.price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${product.discountedPrice}
                  </td>
                  {index === 0 && (
                    <td
                      rowSpan={product.variations.length}
                      className="border border-gray-300 px-4 py-2"
                    >
                      <button
                        className="text-yellow-500 mx-2"
                        onClick={() => handleEdit(product.productID)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 mx-2"
                        onClick={() => handleDelete(product.productID)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
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
    </div>
  );
};

export default Products;
