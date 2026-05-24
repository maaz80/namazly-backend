import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'namazly_secret');
      req.userId = decoded.userId;
      // Set req.session.userId for compatibility if needed
      if (req.session) {
        req.session.userId = decoded.userId;
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
  }

  // Fallback to session check for backward compatibility or local dev without headers
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

