module.exports = (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    return res.redirect(`https://${req.get('host')}${req.originalUrl || req.url}`);
  }
};
