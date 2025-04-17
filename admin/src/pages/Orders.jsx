import React, { useState, useEffect } from 'react';
import axios from 'axios';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/order/admin/get');
            console.log('API Response:', response.data); 
            setOrders(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/api/order/admin/update`, {
                orderID: id,
                status: newStatus
            });
            
            setOrders(orders.map((order) => {
                if (order.orderID === id) {
                    return { ...order, status: newStatus };
                }
                return order;
            }));
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status');
        }
    };

    const handleCancelOrder = async (id) => {
        try {
            await axios.patch(`http://localhost:4000/api/order/admin/cancel`, { orderID: id });
            setOrders(orders.map((order) => {
                if (order.orderID === id) {
                    return { ...order, status: 'Cancelled' };
                }
                return order;
            }));
            alert('Order has been cancelled successfully');
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Failed to cancel order');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order Management</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4"> Order List</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Order ID</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Customer</th>
                        <th className="border border-gray-300 px-4 py-2">Address</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Products</th>
                        <th className="border border-gray-300 px-4 py-2">Total</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{order.orderID}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div>
                                    <div className="font-medium">
                                        {order.shippingAddress?.fullName || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.shippingAddress?.phone || 'N/A'}
                                    </div>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {order.shippingAddress ? 
                                    `${order.shippingAddress.address}, ${order.shippingAddress.city}` : 
                                    'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.orderID, e.target.value)}
                                    className="border border-gray-300 rounded-md p-1"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <ul className="list-none">
                                    {order.items && order.items.map((item, index) => (
                                        <li key={index} className="mb-1">
                                            <span className="font-medium">
                                                {/* Kiểm tra nếu productID tồn tại */}
                                                {item.product && item.product.productName ? item.product.productName : 'Unnamed Product'}
                                            </span>
                                            <span className="text-gray-500">
                                                {' x'}{item.quantity}
                                            </span>
                                            <div className="text-xs text-gray-500">
                                                Color: {item.color || 'N/A'}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                ${order.totalPrice || 0}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="text-blue-500 hover:underline mr-2"
                                    onClick={() => alert(`Viewing details for Order ID: ${order.orderID}`)}
                                >
                                    View
                                </button>
                                {order.status !== 'Cancelled' && (
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleCancelOrder(order.orderID)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Orders;