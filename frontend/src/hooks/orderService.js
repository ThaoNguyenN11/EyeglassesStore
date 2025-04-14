import axios from "axios";

const API_URL = "http://localhost:4000/api/order";

// Lấy đơn hàng của người dùng
export const getUserOrders = async (userID) => {
  try {
    const response = await axios.get(`${API_URL}/user/get`, {
      params: { userID },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    console.log("Sending order data to server:", orderData);

    const response = await axios.post(`${API_URL}/user/create`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("Server response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create order");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Hủy đơn hàng (User)
export const cancelOrder = async (orderID) => {
  try {
    const response = await axios.patch(`${API_URL}/user/${orderID}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
