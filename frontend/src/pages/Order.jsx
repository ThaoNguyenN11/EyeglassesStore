import React from 'react';
import { useLocation } from 'react-router-dom';

const Order = () => {
    const location = useLocation();
    const { order } = location.state; // Lấy thông tin đơn hàng từ state

    const formatPrice = (price) => `VND ${price.toLocaleString('id-ID')}`;

    // Tính tổng giá trị đơn hàng
    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Header with Order ID and Status */}
            <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Order ID: {order.id}</span>
                <span className="text-orange-500">{order.status}</span>
            </div>

            {/* Shipping Details */}
            <div className="flex items-center gap-2 mb-6">
                <span>From: {order.from}</span>
                <div className="flex-1 border-b border-dashed mx-2"></div>
                <div className="text-gray-500 text-sm">
                    Estimated arrival: {order.estimatedArrival}
                </div>
                <div className="flex-1 border-b border-dashed mx-2"></div>
                <span>To: {order.to}</span>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
                <h3 className="font-medium">Payment Method:</h3>
                <p className="text-gray-600">{order.paymentMethod}</p>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
                {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
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

            {/* Total */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <span className="font-medium">Total:</span>
                <div className="flex items-center gap-4">
                    <span className="font-medium">{formatPrice(total)}</span>
                    <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Order;
