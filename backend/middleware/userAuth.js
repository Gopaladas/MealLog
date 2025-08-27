import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized Login Again" 
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", tokenDecode);
    
    // Check for common user ID property names
    const userId = tokenDecode.userId || tokenDecode.id || tokenDecode._id;
    
    if (userId) {
      req.userId = userId;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized Login Again" 
    });
  }
};

export default userAuth;
