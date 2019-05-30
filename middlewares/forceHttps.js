module.exports = (req, res, next) => {
  console.log('req secure : ' + req.secure);
  if (req.secure || req.get('X-Forwarded-Proto') !== 'https') {
    return next();
  } else {
    return res.redirect(`https://${req.get('host')}${req.originalUrl || req.url}`);
  }
};
