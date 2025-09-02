import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token Provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id}
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

export const verifyAdmin = (req, res, next) => {
  if ((req, res, next === "admin")) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
};
