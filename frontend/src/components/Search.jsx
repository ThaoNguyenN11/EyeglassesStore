import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className="border-t border-b bg-gray-50 text-center p-4">
      <div className="relative inline-flex items-center border border-gray-400 px-5 py-2 rounded-full w-3/4 sm:w-1/2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Enter search keyword"
        />
        <button onClick={handleSearch} className="ml-2 px-3 py-1  rounded">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};

export default Search;
