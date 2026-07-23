// @desc    Protect routes - require authentication
export const protect = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authorized, please log in' });
  }
  next();
};

// @desc    Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};