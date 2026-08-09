import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Support both `decoded.id` and `decoded._id`
      const userId = decoded.id || decoded._id;

      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload structure" });
      }

      // Get user from database
      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found with this token" });
      }

      return next(); // Return next() to prevent duplicate handler execution
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};