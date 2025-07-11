const checkVerified = (req, res, next) => {
  if (!req.user?.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Email verification required",
      code: "EMAIL_NOT_VERIFIED",
    });
  }
  next();
};

export default checkVerified;
