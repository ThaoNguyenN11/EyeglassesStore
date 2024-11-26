import React, { useState } from 'react';

const initialOrders = [
    {
        id: '1',
        date: '2024-11-01',
        address: '123 Main St, City, Country',
        status: 'Pending',
        products: [
            { name: 'Sporty Wrap-Around Sunglasses', quantity: 2, price: 280 },
            { name: 'Adjustable Eyewear Strap', quantity: 1, price: 20 },
        ],
        total: 580,
    },
    {
        id: '2',
        date: '2024-11-02',
        address: '456 Elm St, City, Country',
        status: 'Shipped',
        products: [
            { name: 'Vintage Round Sunglasses', quantity: 1, price: 290 },
            { name: 'Microfiber Cleaning Cloth', quantity: 3, price: 10 },
        ],
        total: 320,
    },
    {
      id: '3',
      date: '2024-11-03',
      address: '789 Phan Dinh Phung, Hanoi, Vietnam',
      status: 'Pending',
      products: [
          { name: 'Trendy Cat-Eye Sunglasses', quantity: 1, price: 250 },
          { name: 'Blue Light Blocking Glasses', quantity: 2, price: 150 },
          { name: 'Classic Wayfarer Sunglasses', quantity: 1, price: 300 },
          { name: 'Polarized Sunglasses', quantity: 1, price: 350 },
      ],  
      total: 550,
  },
  {
      id: '4',
      date: '2024-11-04',
      address: '101 Hoang Hoa Tham, Hanoi, Vietnam',
      status: 'Delivered',
      products: [
          { name: 'Classic Wayfarer Sunglasses', quantity: 1, price: 300 },
          { name: 'Polarized Sunglasses', quantity: 1, price: 350 },
      ],
      total: 650,
  },
];

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
    const [orders, setOrders] = useState(initialOrders);

    const handleStatusChange = (id, newStatus) => {
        const updatedOrders = orders.map((order) => {
            if (order.id === id) {
                return { ...order, status: newStatus };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Address</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Products</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{order.id}</td>
                            <td className="py-2 px-4 border-b">{order.date}</td>
                            <td className="py-2 px-4 border-b">{order.address}</td>
                            <td className="py-2 px-4 border-b">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="border border-gray-300 rounded-md p-1"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <ul>
                                    {order.products.map((product, index) => (
                                        <li key={index}>
                                            {product.name} (x{product.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="py-2 px-4 border-b">${order.total}</td>
                            <td className="py-2 px-4 border-b">
                                <button className="text-blue-500 hover:underline">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
