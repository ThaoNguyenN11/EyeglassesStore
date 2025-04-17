// import React, { useEffect, useState, useContext } from 'react';
// import { getUserOrders } from '../hooks/orderService';
// import { assets } from '../assets/assets';
// import { AuthContext } from '../context/AuthContext';

// const MyOrders = () => {
//     const { user } = useContext(AuthContext);
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Kiểm tra xem user đã được cập nhật chưa
//         if (!user) return; // Nếu user chưa có giá trị, thì không thực hiện fetchOrders

//         const fetchOrders = async () => {
//             console.log("Current user:", user); // Debugging log

//             const userID = user?.userID; // Đảm bảo user.id lấy đúng từ AuthContext
//             console.log("User ID:", userID);

//             if (!userID) {
//                 setError('User ID not found.');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const data = await getUserOrders(userID);
//                 console.log("Orders data:", data); // Debugging log
//                 if (data && data.data) {
//                     setOrders(data.data);
//                 } else {
//                     setError('Invalid response format');
//                 }
//             } catch (err) {
//                 console.error("Order fetch error:", err);
//                 setError('Failed to load orders');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [user]); // Chỉ gọi khi `user` thay đổi

//     // Hàm định dạng giá trị tiền
//     const formatPrice = (price) => {
//         if (typeof price !== 'number') return '$ 0';
//         return `$ ${price.toLocaleString('id-ID')}`;
//     };

//     if (loading) return <div className="max-w-2xl mx-auto p-4 text-center">Loading orders...</div>;
//     if (error) return <div className="max-w-2xl mx-auto p-4 text-center text-red-500">{error}</div>;
//     if (!orders || orders.length === 0) return <div className="max-w-2xl mx-auto p-4 text-center">No orders found.</div>;

//     return (
//         <div className="max-w-2xl mx-auto p-4">
//             {orders.map((order) => {
//                 return (
//                     <div key={order.orderID} className="mb-8 border-b pb-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <span className="font-medium">Order ID: {order.orderID}</span>
//                             <span className="text-orange-500">{order.status}</span>
//                         </div>
//                         <div className="space-y-4">
//                             {order.items && order.items.map((item, index) => (
//                                 <div key={index} className="flex gap-4">
//                                     <div className="flex-1">
//                                         <h3 className="font-medium">
//                                             {item.product?.productName || 'Product Name Unavailable'}
//                                         </h3>
//                                         <div className="flex items-center justify-between mt-2">
//                                             <p className="font-medium">
//                                                 {formatPrice(item.price)}
//                                                 <span className="text-gray-500 text-sm ml-1">x{item.quantity}</span>
//                                             </p>
//                                             <p className="text-gray-600">{item.color}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="flex items-center justify-between mt-6 pt-4 border-t">
//                             <span className="font-medium">Total:</span>
//                             <div className="flex items-center gap-4">
//                                 <span className="font-medium">{formatPrice(order.totalPrice)}</span>
//                                 <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600">Details</button>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default MyOrders;

import React, { useEffect, useState, useContext } from 'react';
import { getUserOrders } from '../hooks/orderService';
import { AuthContext } from '../context/AuthContext';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            const userID = user?.userID;
            if (!userID) {
                setError('User ID not found.');
                setLoading(false);
                return;
            }

            try {
                const data = await getUserOrders(userID);
                if (data && data.data) {
                    setOrders(data.data);
                } else {
                    setError('Invalid response format');
                }
            } catch (err) {
                console.error("Order fetch error:", err);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const formatPrice = (price) => {
        if (typeof price !== 'number') return '$ 0';
        return `$ ${price.toLocaleString('id-ID')}`;
    };

    const toggleOrderDetails = (orderId) => {
        if (activeOrder === orderId) {
            setActiveOrder(null);
        } else {
            setActiveOrder(orderId);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-red-800">Error Loading Orders</h3>
                    <p className="mt-2 text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <h3 className="text-xl font-medium text-gray-800">No Orders Found</h3>
                    <p className="mt-2 text-gray-600">You haven't placed any orders yet.</p>
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
            
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.orderID} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer" 
                             onClick={() => toggleOrderDetails(order.orderID)}>
                            <div>
                                <span className="text-sm text-gray-500">Order ID:</span>
                                <span className="ml-2 font-medium">{order.orderID}</span>
                            </div>
                            <div className="flex items-center">
                                <div className={`mr-4 px-3 py-1 rounded-full text-sm font-medium ${
                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Shipped' ? 'bg-orange-100 text-orange-800' :
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status}
                                </div>
                                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeOrder === order.orderID ? 'transform rotate-180' : ''}`} 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                        
                        {activeOrder === order.orderID && (
                            <div className="p-4">
                                <div className="border-b pb-4 mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                                    <div className="text-sm text-gray-600">
                                        <p>{order.shippingAddress?.fullName}</p>
                                        <p>{order.shippingAddress?.address}</p>
                                        <p>{order.shippingAddress?.city}</p>
                                        <p>{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>
                                
                                <h3 className="font-medium text-gray-700 mb-3">Items</h3>
                                <div className="space-y-4 mb-4">
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className="flex items-center border-b pb-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 mr-4"></div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {item.product?.productName || 'Product'}
                                                </h4>
                                                <div className="flex items-center mt-1 text-sm">
                                                    <span className="text-gray-600">Color: {item.color}</span>
                                                    <span className="mx-2 text-gray-300">|</span>
                                                    <span className="text-gray-600">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(item.price)}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Total: {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <span className="text-gray-600">Order Total:</span>
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        {formatPrice(order.totalPrice)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;