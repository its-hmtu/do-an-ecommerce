exports.setUploadPath = (uploadPath) => {
  return (req, res, next) => {
    req.upload_path = uploadPath;
    next();
  }
}