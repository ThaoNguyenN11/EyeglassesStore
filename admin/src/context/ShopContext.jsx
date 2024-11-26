import React, { createContext, useState } from 'react';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([
        // Initial product list
    ]);

    const addProduct = (product) => {
        setProducts((prevProducts) => [...prevProducts, { ...product, _id: `p_${prevProducts.length + 1}` }]);
    };

    return (
        <ShopContext.Provider value={{ products, addProduct }}>
            {children}
        </ShopContext.Provider>
    );
};
