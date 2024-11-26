import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';



const initialProducts = [
    // Các sản phẩm mẫu như đã cho ở mã trước
    {
        _id: "p_c1",
        name: "Classic Round Eyeglass Frame",
        description: "A stylish and durable round eyeglass frame, made from high-quality materials for everyday wear.",
        price: 200,
        image: "path/to/image/p_c1.jpg",
        category: "Eyewear",
        subCategory: "Frames",
        colors: ["Black", "Brown", "Silver"],
        date: 1716634345448,
        bestseller: true
    },
    {
        _id: "p_c2",
        name: "Modern Square Eyeglass Frame",
        description: "A contemporary square eyeglass frame designed for both comfort and fashion, suitable for any face shape.",
        price: 220,
        image: "admin/src/assets/p_c2.png",
        category: "Eyewear",
        subCategory: "Frames",
        colors: ["Black", "Gray", "Gold"],
        date: 1716634345449,
        bestseller: false
    },
    // Các sản phẩm khác
];

const Products = () => {
    const [products, setProducts] = useState(initialProducts);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Tạo phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: '',
        subCategory: '',
        colors: ''
    });

    const handleAddProduct = () => {
        setProducts([...products, { ...newProduct, _id: `p_${products.length + 1}` }]);
        setNewProduct({ name: '', price: '', category: '', subCategory: '', colors: '' });
        setShowModal(false);
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-5">
            <div className="flex justify-end mb-4">
               <Link to="/add">
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center p-2 bg-blue-500 text-white rounded"
                >
                    <FaPlus className="h-5 w-5 mr-2" /> ADD
                </button>
                </Link>
            </div>

            {/* Modal Pop-up */}
            {/* {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-medium mb-4">Add New Product</h2>
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="border p-2 w-full mb-4 rounded"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="border p-2 w-full mb-4 rounded"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            className="border p-2 w-full mb-4 rounded"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Subcategory"
                            className="border p-2 w-full mb-4 rounded"
                            value={newProduct.subCategory}
                            onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Colors (comma-separated)"
                            className="border p-2 w-full mb-4 rounded"
                            value={newProduct.colors}
                            onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                                Add Product
                            </button>
                            <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Product Table */}
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">Image</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Subcategory</th>
                        <th className="border border-gray-300 px-4 py-2">Colors</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={product._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                            <td className="border border-gray-300 px-4 py-2">${product.price}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.subCategory}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.colors.join(", ")}</td>
                            <td className="border border-gray-300 px-4 py-2 ">
                                <button className="text-yellow-500 mx-2">
                                    <FaEdit />
                                </button>
                                <button className="text-red-500 mx-2">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Products;
