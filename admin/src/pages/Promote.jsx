import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Promote = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, type: 'Discount', value: 20, startDate: '2024-11-01', endDate: '2024-12-01', product: 'Sunglasses' },
    { id: 2, type: 'Buy One Get One', value: 50, startDate: '2024-11-15', endDate: '2024-11-30', product: 'Glasses Strap' },
    { id: 3, type: 'Discount', value: 15, startDate: '2024-11-20', endDate: '2024-11-28', product: 'Frames' },
    // Add more promotions as needed
  ]);
  const [newPromotion, setNewPromotion] = useState({ type: '', value: '', startDate: '', endDate: '', product: '' });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(promotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPromotions = promotions.slice(startIndex, startIndex + itemsPerPage);

  // Handle adding new promotion
  const handleAddPromotion = () => {
    setPromotions([...promotions, { ...newPromotion, id: promotions.length + 1 }]);
    setNewPromotion({ type: '', value: '', startDate: '', endDate: '', product: '' });
    setShowModal(false); // Close the modal after adding
  };

  // Handle deleting promotion
  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Promotion Management</h1>

      {/* Add New Promotion Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
      >
        <FaPlus className="mr-2" /> Add Promotion
      </button>

      {/* Add New Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-4">Add New Promotion</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Promotion Type"
                value={newPromotion.type}
                onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Value (%)"
                value={newPromotion.value}
                onChange={(e) => setNewPromotion({ ...newPromotion, value: e.target.value })}
              />
              <input
                type="date"
                className="border p-2 rounded"
                placeholder="Start Date"
                value={newPromotion.startDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
              />
              <input
                type="date"
                className="border p-2 rounded"
                placeholder="End Date"
                value={newPromotion.endDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Product"
                value={newPromotion.product}
                onChange={(e) => setNewPromotion({ ...newPromotion, product: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddPromotion}
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              >
                Add Promotion
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

      {/* Promotion List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Promotion List</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Value (%)</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">Product</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPromotions.map((promo) => (
              <tr key={promo.id}>
                <td className="border border-gray-300 px-4 py-2">{promo.type}</td>
                <td className="border border-gray-300 px-4 py-2">{promo.value}%</td>
                <td className="border border-gray-300 px-4 py-2">{promo.startDate}</td>
                <td className="border border-gray-300 px-4 py-2">{promo.endDate}</td>
                <td className="border border-gray-300 px-4 py-2">{promo.product}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-yellow-500 mr-2">
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeletePromotion(promo.id)}
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

export default Promote;
