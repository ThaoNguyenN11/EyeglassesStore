import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const AVAILABLE_COLORS = [
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

const Warehouse = () => {
  const [warehouseEntries, setWarehouseEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [newEntry, setNewEntry] = useState({
    importID: "",
    productID: "",
    color: "",
    importDate: "",
    quantity: "",
    importPrice: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Fetch warehouse entries
  useEffect(() => {
    const fetchWarehouseEntries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:4000/api/warehouse/list"
        );
        if (response.data.success) {
          setWarehouseEntries(response.data.data);
        }
      } catch (err) {
        setError("Error fetching warehouse entries: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouseEntries();
  }, []);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products");
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(warehouseEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = warehouseEntries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle adding new warehouse entry
  const handleAddEntry = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/warehouse/add",
        newEntry
      );
      if (response.data.success) {
        setWarehouseEntries([...warehouseEntries, response.data.data]);
        setNewEntry({
          importID: "",
          productID: "",
          color: "",
          importDate: "",
          quantity: "",
          importPrice: "",
        });
        setShowModal(false);
      }
    } catch (err) {
      setError(
        "Error adding warehouse entry: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Handle adding new warehouse
  const handleAddWarehouse = async () => {
    try {
      const response = await axios.post("/api/warehouse/add", {
        name: warehouseName, // Đảm bảo các trường này có giá trị
        location: warehouseLocation,
      });
      console.log("Warehouse added:", response.data);
    } catch (error) {
      console.error(
        "Error adding warehouse:",
        error.response?.data || error.message
      );
    }
  };

  // Handle deleting warehouse entry
  const handleDeleteEntry = async (importID) => {
    try {
      // Assuming you have a delete endpoint
      await axios.delete(`http://localhost:4000/api/warehouse/${importID}`);
      setWarehouseEntries(
        warehouseEntries.filter((entry) => entry.importID !== importID)
      );
    } catch (err) {
      setError("Error deleting warehouse entry: " + err.message);
    }
  };

  // Handle changing page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Warehouse Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add New Entry Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
      >
        <FaPlus className="mr-2" /> Add Warehouse Entry
      </button>

      {/* Add New Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-medium mb-4">
              Add New Warehouse Entry
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Import ID
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mt-1"
                  placeholder="Enter import ID"
                  value={newEntry.importID}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, importID: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product ID
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mt-1"
                  placeholder="Enter product ID"
                  value={newEntry.productID}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, productID: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <select
                  className="w-full border p-2 rounded mt-1"
                  value={newEntry.color}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, color: e.target.value })
                  }
                >
                  <option value="">Select a color</option>
                  {AVAILABLE_COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Import Date
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded mt-1"
                  value={newEntry.importDate}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, importDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full border p-2 rounded mt-1"
                  placeholder="Enter quantity"
                  value={newEntry.quantity}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      quantity: parseInt(e.target.value) || "",
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Import Price
                </label>
                <input
                  type="number"
                  className="w-full border p-2 rounded mt-1"
                  placeholder="Enter price"
                  value={newEntry.importPrice}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      importPrice: parseFloat(e.target.value) || "",
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddEntry}
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              >
                Add Entry
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

      {/* Warehouse Entries List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Warehouse Entries</h2>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : warehouseEntries.length === 0 ? (
          <div className="text-center py-4">No warehouse entries found</div>
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Import ID</th>
                <th className="border border-gray-300 px-4 py-2">Product ID</th>
                <th className="border border-gray-300 px-4 py-2">Color</th>
                <th className="border border-gray-300 px-4 py-2">
                  Import Date
                </th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">
                  Import Price
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry) => (
                <tr key={entry.importID}>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.importID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.productID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.color}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(entry.importDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.importPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
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
        )}
      </div>
    </div>
  );
};

export default Warehouse;
