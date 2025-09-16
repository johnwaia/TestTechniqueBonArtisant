const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user'); 

module.exports = async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const parts = auth.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    let userId =
      payload?.id ||
      payload?._id ||
      payload?.userId ||
      payload?.user?._id ||
      payload?.user?.id ||
      payload?.sub; 

    if (userId && typeof userId !== 'string') userId = String(userId);

    if (!userId && (payload?.username || payload?.email)) {
      const query = payload.username
        ? { username: payload.username }
        : { email: payload.email };
      const u = await User.findOne(query).select('_id');
      if (u) userId = String(u._id);
    }

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Token invalide (id manquant)' });
    }

    req.user = { id: userId };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};