import React, { useState, useEffect } from "react";
import axios from "axios";

const MyProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    faceShape: "",
    avatar: "",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Gọi API lấy thông tin user
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user/profile",
          {
            withCredentials: true, // Nếu dùng JWT với cookies
          }
        );
        console.log("User data:", response.data.user); // Debug toàn bộ dữ liệu
        console.log("Avatar path:", response.data.user.avatar); // Kiểm tra URL avatar
        setUser(response.data.user);
        setPreviewImage(response.data.user.avatar);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Tạo URL tạm để hiển thị ngay
      setPreviewImage(imageUrl); // Cập nhật UI ngay lập tức
      setImage(file); // Lưu file vào state để gửi đi khi nhấn "Save Changes"
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      formData.append("address", user.address);
      formData.append("gender", user.gender);
      formData.append("faceShape", user.faceShape);
  
      if (image) {
        formData.append("avatar", image); // Nếu có ảnh mới, gửi lên server
      }
  
      const response = await axios.put(
        "http://localhost:4000/api/user/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // Để gửi file
        }
      );
  
      setUser(response.data.user); // Cập nhật thông tin mới vào state
      setPreviewImage(response.data.user.avatar); // Cập nhật UI với ảnh mới
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
      console.error("Update profile error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-8">
      <div className="w-full max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={previewImage}
              alt="User Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Your Photo</p>
            <label className="block mb-2">
              <input
                type="file"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="px-4 py-2 text-sm bg-gray-100 border rounded-lg hover:bg-gray-200 cursor-pointer inline-block">
                Upload New
              </span>
            </label>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-700">Full Name</span>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Address</span>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Gender</span>
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-gray-700">Face Shape</span>
                <select
                  name="faceShape"
                  value={user.faceShape}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Face Shape</option>
                  <option value="oval">Oval</option>
                  <option value="square">Square</option>
                  <option value="round">Round</option>
                  <option value="diamond">Diamond</option>
                  <option value="rectangular">Rectangular</option>
                  <option value="heart">Heart</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {message && (
              <p className="text-center text-sm mt-4 text-green-600">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
