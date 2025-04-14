import React, { useEffect, useState, useContext } from 'react';
import { getUserOrders } from '../hooks/orderService';
import { assets } from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Kiểm tra xem user đã được cập nhật chưa
        if (!user) return; // Nếu user chưa có giá trị, thì không thực hiện fetchOrders

        const fetchOrders = async () => {
            console.log("Current user:", user); // Debugging log

            const userID = user?.userID; // Đảm bảo user.id lấy đúng từ AuthContext
            console.log("User ID:", userID);

            if (!userID) {
                setError('User ID not found.');
                setLoading(false);
                return;
            }

            try {
                const data = await getUserOrders(userID);
                console.log("Orders data:", data); // Debugging log
                setOrders(data.data);
            } catch (err) {
                console.error("Order fetch error:", err);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]); // Chỉ gọi khi `user` thay đổi

    // Hàm định dạng giá trị tiền
    const formatPrice = (price) => `$ ${price.toLocaleString('id-ID')}`;

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;
    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {orders.map((order) => {
                const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return (
                    <div key={order.orderID} className="mb-8 border-b pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Order ID: {order.orderID}</span>
                            <span className="text-orange-500">{order.status}</span>
                        </div>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div className="flex gap-4">
                                    {/* Nếu có image trong API, bạn có thể hiển thị */}
                                    {/* <img
                                        src={item.product.image || "/default-image.png"} // Default image nếu không có
                                        alt={item.product.productName}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    /> */}
                                    <div className="flex-1">
                                        {/* <h3 className="font-medium">{item.product.productName}</h3> */}
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="font-medium">
                                                {formatPrice(item.price)}
                                                <span className="text-gray-500 text-sm ml-1">x{item.quantity}</span>
                                            </p>
                                            <p className="text-gray-600">{item.color}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <span className="font-medium">Total:</span>
                            <div className="flex items-center gap-4">
                                <span className="font-medium">{formatPrice(total)}</span>
                                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600">Details</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    
};

export default MyOrders;
