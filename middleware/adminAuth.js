import jwt from 'jsonwebtoken';

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'namazly_secret');
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access denied' });
    }
    req.adminEmail = decoded.email;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token' });
  }
};
