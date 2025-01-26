import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Promote = () => {
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [promotionData, setPromotionData] = useState({
    promotionID: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discountPercentage: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(promotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPromotions = promotions.slice(startIndex, startIndex + itemsPerPage);

  // Fetch data from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/promotion/list');
        const data = await response.json();
        if (data.success) {
          setPromotions(data.data);
        } else {
          console.error('Failed to fetch promotions:', data.message);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error.message);
      }
    };
    fetchPromotions();
  }, [promotions.length]);

  // Reset form function
  const resetForm = () => {
    setPromotionData({
      promotionID: '',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      discountPercentage: ''
    });
    setIsEditMode(false);
  };

  // Handle edit promotion
  const handleEdit = (promo) => {
    setIsEditMode(true);
    setPromotionData({
      promotionID: promo.promotionID,
      name: promo.name,
      description: promo.description,
      startDate: promo.startDate.split('T')[0],
      endDate: promo.endDate.split('T')[0],
      discountPercentage: promo.discountPercentage
    });
    setShowModal(true);
  };

  // Handle delete promotion
  const handleDelete = async (promotionID) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/promotion/remove/${promotionID}`, {
        method: 'PATCH'
      });

      const data = await response.json();
      if (data.success) {
        setPromotions(promotions.filter((promo) => promo.promotionID !== promotionID));
      } else {
        alert('Failed to delete promotion: ' + data.message);
      }
    } catch (error) {
      alert('Error deleting promotion: ' + error.message);
    }
  };

  // Handle submit form (Add or Edit promotion)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form
    if (!promotionData.name?.trim()) {
      alert('Please enter promotion name');
      return;
    }
  
    if (!promotionData.startDate) {
      alert('Please select start date');
      return;
    }
  
    if (!promotionData.endDate) {
      alert('Please select end date');
      return;
    }
  
    if (!promotionData.discountPercentage || 
        promotionData.discountPercentage < 0 || 
        promotionData.discountPercentage > 100) {
      alert('Please enter a valid discount percentage (0-100)');
      return;
    }
  
    // Validate dates
    const startDate = new Date(promotionData.startDate);
    const endDate = new Date(promotionData.endDate);
  
    if (startDate >= endDate) {
      alert('End date must be after start date');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const formattedData = {
        ...promotionData,
        startDate: new Date(promotionData.startDate).toISOString(),
        endDate: new Date(promotionData.endDate).toISOString(),
      };
  
      if (!isEditMode) {
        // Add new promotion
        const response = await fetch('http://localhost:4000/api/promotion/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });
  
        const data = await response.json();
        if (data.success) {
          setPromotions((prevPromotions) => [data.data, ...prevPromotions]);
          resetForm();
          setShowModal(false);
        } else {
          alert('Failed to add promotion: ' + (data.message || 'Unknown error'));
        }
      } else {
        // Edit promotion
        const response = await fetch(
          `http://localhost:4000/api/promotion/edit/${promotionData.promotionID}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
          }
        );
  
        const data = await response.json();
        if (data.success) {
          setPromotions((prevPromos) =>
            prevPromos.map((promo) =>
              promo.promotionID === formattedData.promotionID ? data.data : promo
            )
          );
          resetForm();
          setShowModal(false);
        } else {
          alert('Failed to update promotion: ' + (data.message || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error details:', error);
      alert('Error processing promotion: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Promotion Management</h1>

      {/* Add New Promotion Button */}
      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
      >
        <FaPlus className="mr-2" /> Add Promotion
      </button>

      {/* Promotion List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Promotion List</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">Discount (%)</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPromotions.map((promo) => (
              <tr key={promo.promotionID}>
                <td className="border border-gray-300 px-4 py-2">{promo.promotionID}</td>
                <td className="border border-gray-300 px-4 py-2">{promo.name}</td>
                <td className="border border-gray-300 px-4 py-2">{promo.description}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(promo.startDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(promo.endDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{promo.discountPercentage}%</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => handleEdit(promo)} className="text-yellow-500 mr-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(promo.promotionID)} className="text-red-500">
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
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Add or Edit Promotion */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? 'Edit Promotion' : 'Add Promotion'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Promotion ID *</label>
                <input
                  type="text"
                  className="border border-gray-300 w-full p-2 rounded"
                  value={promotionData.promotionID}
                  onChange={(e) => setPromotionData({ ...promotionData, promotionID: e.target.value })}
                  required
                  disabled={isEditMode}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  className="border border-gray-300 w-full p-2 rounded"
                  value={promotionData.name}
                  onChange={(e) => setPromotionData({ ...promotionData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  className="border border-gray-300 w-full p-2 rounded"
                  value={promotionData.description}
                  onChange={(e) => setPromotionData({ ...promotionData, description: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  className="border border-gray-300 w-full p-2 rounded"
                  value={promotionData.startDate}
                  onChange={(e) => setPromotionData({ ...promotionData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  className="border border-gray-300 w-full p-2 rounded"
                  value={promotionData.endDate}
                  onChange={(e) => setPromotionData({ ...promotionData, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Discount Percentage *</label>
                <input
                  type="number"
                  className="border border-gray-300 w-full p-2 rounded"
                  value={promotionData.discountPercentage}
                  onChange={(e) => setPromotionData({ ...promotionData, discountPercentage: e.target.value })}
                  required
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="text-red-500"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promote;