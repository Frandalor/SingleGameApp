import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from '../lib/env.js';

export const loginRequired = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - no token provided' });
    } // jwt nome scelto quando si invia token

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - invalid token' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('error in protectRoute middleware:', error);
    res.status(500).json({ message: 'internal error' });
  }
};

export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Accesso negato. Sono richiesti permessi di amministratore.',
    });
  }
};

export const checkColabOrAdmin = (req, res, next) => {
  const allowedRoles = ['colab', 'admin'];

  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Accesso negato.' });
  }
};
