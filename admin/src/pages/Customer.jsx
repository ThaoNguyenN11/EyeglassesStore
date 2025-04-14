import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [orderPage, setOrderPage] = useState(1);
  const [ordersPerPage] = useState(3);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/user/admin/getInfo");
      const data = await response.json();
      setCustomers(data.users);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleViewOrders = async (id) => {
    setSelectedUser(id);
    setIsModalOpen(true);
    setOrderPage(1); // Reset order page when viewing a new user
    try {
      const response = await fetch(`http://localhost:4000/api/order/admin/getUserOrders?userID=${id}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get current customers
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Get current orders
  const indexOfLastOrder = orderPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total pages
  const totalCustomerPages = Math.ceil(customers.length / customersPerPage);
  const totalOrderPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">User List</h2>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Face Shape</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.gender}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.faceShape}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => handleViewOrders(customer.id)} className="text-blue-500 mx-2">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Simple pagination for customers */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalCustomerPages }, (_, index) => (
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

      {/* Modal hiển thị đơn hàng chi tiết */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Order Details"
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-10 max-h-5xl overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto pt-10 pb-10"
      >
        <h2 className="text-2xl font-bold mb-4">Orders for User ID: {selectedUser}</h2>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {currentOrders.map((order) => (
              <div key={order.orderID} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Order ID: {order.orderID}</h3>
                  <span className={`px-3 py-1 rounded-full text-white ${
                    order.status === 'Delivered' ? 'bg-green-500' : 
                    order.status === 'Cancelled' ? 'bg-red-500' : 
                    order.status === 'Processing' ? 'bg-yellow-500' : 
                    order.status === 'Shipped' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Date:</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method:</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status:</p>
                    <p className="font-medium">{order.isPaid ? `Paid (${formatDate(order.paidAt)})` : 'Not Paid'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Price:</p>
                    <p className="font-medium text-lg">${order.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Shipping Address</h4>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p><span className="font-medium">Name:</span> {order.shippingAddress.fullName}</p>
                    <p><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</p>
                    <p><span className="font-medium">Address:</span> {order.shippingAddress.address}</p>
                    <p><span className="font-medium">City:</span> {order.shippingAddress.city}</p>
                  </div>
                </div>

                <h4 className="text-lg font-medium mb-2">Order Items</h4>
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Product ID</th>
                      <th className="border border-gray-300 px-4 py-2">Color</th>
                      <th className="border border-gray-300 px-4 py-2">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2">Price</th>
                      <th className="border border-gray-300 px-4 py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{item.productID}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.color}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2">${item.price.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">${(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {/* Simple pagination for orders */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalOrderPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setOrderPage(index + 1)}
                  className={`px-3 py-1 mx-1 rounded ${
                    orderPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No orders found for this user.</p>
        )}
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Customer;