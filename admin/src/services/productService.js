import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/product";

// Lấy danh sách sản phẩm đang hoạt động
export const getActiveProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/activeProduct`);
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

// Xóa sản phẩm
export const removeProduct = async (productID) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/remove/${productID}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: error.message };
  }
};

// Chỉnh sửa sản phẩm
export const editProduct = async (productID, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/edit/${productID}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error editing product:", error);
    return { success: false, message: error.message };
  }
};

//Lấy thông tin 1 sản phẩm
export const getSingleProduct = async (productID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/single/${productID}`);
        return response.data;
    } catch (error) {
        console.error("Error getting single product: ", error);
        throw error;
    }
};
