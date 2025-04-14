import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const SearchResult = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy từ khóa tìm kiếm từ URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";

  useEffect(() => {
    fetchSearchResults();
  }, [query]); // Chạy lại khi query thay đổi

  const fetchSearchResults = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/product/search?query=${query}`);
      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (products.length === 0) return <p className="text-center text-gray-500">No results found for "{query}"</p>;

  return (
    <div>
      <div className="flex justify-between text-base sm:text-2xl mb-4">
        <p>Search Results for: "{query}"</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {products.map((product) => {
          const imageUrl = product.variations?.[0]?.imageUrls?.[0] || "/placeholder.jpg";

          return (
            <div key={product.productID} className="flex flex-col items-center border border-gray-200 p-4 rounded-lg">
              <Link to={`/product/${product.productID}`}>
                <img src={imageUrl} alt={product.productName} className="w-full h-32 object-cover mb-2" />
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
