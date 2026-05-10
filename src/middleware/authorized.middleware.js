// create authorization middleware

const authorize = (roles) => {
  return async (req, res, next) => {
    try {
      const decoded = req.user;
      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Unauthorized, please contact administrator" });
    }
  };
};

export default authorize;
