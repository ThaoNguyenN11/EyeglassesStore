import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; 

const Customer = () => {
  // Sample customer data
  const initialCustomers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', gender: 'Male', phone: '0123456789', faceShape: 'Oval' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', gender: 'Female', phone: '0987654321', faceShape: 'Round' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', gender: 'Male', phone: '0912345678', faceShape: 'Square' },
    { id: 4, name: 'Phạm Thị D', email: 'thid@example.com', gender: 'Female', phone: '0765432109', faceShape: 'Heart' },
    { id: 5, name: 'Đỗ Văn E', email: 'vane@example.com', gender: 'Male', phone: '0856781234', faceShape: 'Diamond' },
    { id: 6, name: 'Nguyễn Thị F', email: 'thif@example.com', gender: 'Female', phone: '0998765432', faceShape: 'Rectangle' },
    { id: 7, name: 'Lê Văn G', email: 'vang@example.com', gender: 'Male', phone: '0901234567', faceShape: 'Triangular' },
    { id: 8, name: 'Trần Thị H', email: 'thih@example.com', gender: 'Female', phone: '0845678901', faceShape: 'Inverted Triangle' },
    { id: 9, name: 'Phạm Văn I', email: 'vani@example.com', gender: 'Male', phone: '0712345678', faceShape: 'Oval' },
    { id: 10, name: 'Nguyễn Thị J', email: 'thij@example.com', gender: 'Female', phone: '0687654321', faceShape: 'Round' },
    { id: 11, name: 'Lê Văn K', email: 'vank@example.com', gender: 'Male', phone: '0634567890', faceShape: 'Square' },
    { id: 12, name: 'Đỗ Thị L', email: 'thil@example.com', gender: 'Female', phone: '0543219876', faceShape: 'Heart' },
    { id: 13, name: 'Nguyễn Văn M', email: 'vanm@example.com', gender: 'Male', phone: '0456789123', faceShape: 'Diamond' },
    { id: 14, name: 'Trần Thị N', email: 'thin@example.com', gender: 'Female', phone: '0398765432', faceShape: 'Rectangle' },
  ];

  const [customers, setCustomers] = useState(initialCustomers); 

  const handleEdit = (id) => {
    console.log(`Edit customer with id: ${id}`);
    
  };

  const handleDelete = (id) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id); 
    setCustomers(updatedCustomers); 
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Information</h1>
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
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.gender}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.faceShape}</td>
              <td className="border border-gray-300 px-4 py-2 ">
                <button onClick={() => handleEdit(customer.id)} className="text-yellow-500">
                  <FaEdit />
                </button>
                <t/>
                <button onClick={() => handleDelete(customer.id)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customer;
