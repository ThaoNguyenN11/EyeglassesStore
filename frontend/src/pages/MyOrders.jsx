import React from 'react';
import { assets } from '../assets/assets';

const MyOrders = () => {
    // Sample order data using your eyewear products
    const order = {
        id: "CTH-89765",
        status: "On Deliver",
        from: "Hanoi, Vietnam",
        to: "DaNang, Vietnam",
        estimatedArrival: "28 Nov 2024",
        items: [
            {
                id: "p_c1",
                name: "Classic Round Eyeglass Frame",
                price: 200,
                color: "brown",
                quantity: 1,
                image: assets.p_c1 // Corrected image access
            },
            {
                id: "p_c2",
                name: "Modern Square Eyeglass Frame",
                price: 220,
                color: "black",
                quantity: 1,
                image: assets.p_c2 // Corrected image access
            }
        ]
    };

    const formatPrice = (price) => `VND ${price.toLocaleString('id-ID')}`;
    
    // Updated total calculation to include quantity
    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Header with Order ID and Status */}
            <div className="flex items-center justify-between mb-4">
                <span className="font-medium">{order.id}</span>
                <span className="text-orange-500">{order.status}</span>
            </div>

            {/* Shipping Details */}
            <div className="flex items-center gap-2 mb-6">
                <span>{order.from}</span>
                <div className="flex-1 border-b border-dashed mx-2"></div>
                <div className="text-gray-500 text-sm">
                    Estimated arrival: {order.estimatedArrival}
                </div>
                <div className="flex-1 border-b border-dashed mx-2"></div>
                <span>{order.to}</span>
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

export default MyOrders;
