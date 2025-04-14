import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token; // Lấy token từ cookie

  if (!token) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gán thông tin user vào req
    console.log("Token verified, user:", decoded);
    next();
  } catch (error) {
    console.log("Invalid token");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export default authMiddleware;
