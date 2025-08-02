module.exports = (req, res, next) => {
  const email = req.headers['email'];
  const password = req.headers['password'];

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return next();
  } else {
    return res.status(403).json({ message: 'You do not have clearance' });
  }
};
