import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";
import cloudinary from "../config/cloudinary.js";
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure this is set correctly
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Login successful, token set in cookie");

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });

    const user = await newUser.save();
    const token = createToken(user._id.toString());

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure this is set correctly
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure this is set correctly
    sameSite: "Lax",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, address, gender, faceShape } = req.body;
  
      // Tìm user trong database
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Nếu có avatar mới, xử lý upload lên Cloudinary
      let newAvatarUrl = user.avatar; // Giữ avatar cũ nếu không cập nhật
  
      if (req.file) {
        // Xóa avatar cũ trên Cloudinary (nếu có)
        if (user.avatar && user.avatar.includes("res.cloudinary.com")) {
          const oldPublicId = user.avatar.split("/").slice(-2).join("/").split(".")[0];
          await cloudinary.uploader.destroy(oldPublicId);
        }
  
        // Upload ảnh mới lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars", 
        });
  
        newAvatarUrl = result.secure_url; // Lấy URL ảnh từ Cloudinary
      }
  
      // Cập nhật thông tin người dùng
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.gender = gender || user.gender;
      user.faceShape = faceShape || user.faceShape;
      user.avatar = newAvatarUrl;
  
      await user.save();
  
      res.json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          faceShape: user.faceShape,
          avatar: user.avatar, // Đảm bảo avatar có trong response
        },
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        userID: user.userID,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        faceShape: user.faceShape,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  updateUser,
  getUserProfile,
  getUser,
  logoutUser,
};
