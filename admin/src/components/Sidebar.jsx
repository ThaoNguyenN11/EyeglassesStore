import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaBullhorn, FaWarehouse } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  
  // Function to check if the current path matches the link path
  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-48 bg-gray-200 text-black flex flex-col shadow-lg sticky top-0">
      {/* <div className="flex items-center justify-center h-16 bg-gray-300">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div> */}
      <ul className="flex flex-col p-4 space-y-2">
        <li>
          <Link to="/dashboard"
            className={`flex items-center py-2 px-4 rounded ${
              isActive('/dashboard') ? 'bg-blue-500 text-white' : 'hover:bg-gray-400'
            }`}
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/product"
            className={`flex items-center py-2 px-4 rounded ${
              isActive('/product') ? 'bg-blue-500 text-white' : 'hover:bg-gray-400'
            }`}
          >
            <FaBox className="mr-3" />
            Product
          </Link>
        </li>
        <li>
          <Link to="/orders"
            className={`flex items-center py-2 px-4 rounded ${
              isActive('/orders') ? 'bg-blue-500 text-white' : 'hover:bg-gray-400'
            }`}
          >
            <FaShoppingCart className="mr-3" />
            Orders
          </Link>
        </li>
        <li>
          <Link to="/customer"
            className={`flex items-center py-2 px-4 rounded ${
              isActive('/customer') ? 'bg-blue-500 text-white' : 'hover:bg-gray-400'
            }`}
          >
            <FaUsers className="mr-3" />
            Customer
          </Link>
        </li>
        <li>
          <Link to="/promote"
            className={`flex items-center py-2 px-4 rounded ${
              isActive('/promote') ? 'bg-blue-500 text-white' : 'hover:bg-gray-400'
            }`}
          >
            <FaBullhorn className="mr-3" />
            Promote
          </Link>
        </li>
        <li>
          <Link to="/warehouse"
            className={`flex items-center py-2 px-4 rounded ${
              isActive('/warehouse') ? 'bg-blue-500 text-white' : 'hover:bg-gray-400'
            }`}
          >
            <FaWarehouse className="mr-3" />
            Warehouse
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
