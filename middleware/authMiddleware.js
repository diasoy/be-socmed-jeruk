import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.userId;
    req.email = decoded.email;
    req.name = decoded.name;
    next();
  });
};
