import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Warehouse = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Round Glasses', date: '2024-11-01', quantity: 100, price: 200 },
    { id: 2, name: 'Sunglasses', date: '2024-11-05', quantity: 50, price: 150 },
    // Add more dummy products as needed for pagination demonstration
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', date: '', quantity: '', price: '' });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  // Handle adding new product
  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ name: '', date: '', quantity: '', price: '' });
    setShowModal(false); // Close the modal after adding product
  };

  // Handle deleting product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Handle changing page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Warehouse Management</h1>

      {/* Add New Product Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
      >
        <FaPlus className="mr-2" /> Add Product
      </button>

      {/* Add New Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-4">Add New Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="date"
                className="border p-2 rounded"
                placeholder="Date"
                value={newProduct.date}
                onChange={(e) => setNewProduct({ ...newProduct, date: e.target.value })}
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddProduct}
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              >
                Add Product
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Product List</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.date}</td>
                <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                <td className="border border-gray-300 px-4 py-2 ">
                  <button className="text-yellow-500 mr-2">
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
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

export default Warehouse;
