import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userID: { type: String, unique: true }, // Mã người dùng
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    gender: { type: String },
    faceShape: { type: String },
  },
  { timestamps: true, minimize: false }
);

// Middleware để tạo userID trước khi lưu người dùng
userSchema.pre("save", async function (next) {
  if (!this.userID) {
    try {
      // Kiểm tra số lượng người dùng hiện có trong cơ sở dữ liệu
      const count = await mongoose.model("user").countDocuments();
      // Tạo userID với định dạng USER0001, USER0002,...
      this.userID = `USER${(count + 1).toString().padStart(4, "0")}`;
    } catch (error) {
      return next(error); // Nếu có lỗi trong quá trình tính toán, gọi next với lỗi
    }
  }
  next();
});

const userModel = mongoose.models.User || mongoose.model("user", userSchema);

export default userModel;
