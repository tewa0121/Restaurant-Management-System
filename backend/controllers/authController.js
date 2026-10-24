const authService = require('../services/authService');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    if (
      err.message.includes('Invalid email') || 
      err.message.includes('deactivated') || 
      err.message.includes('Please provide')
    ) {
      return res.status(401).json({ success: false, message: err.message });
    }
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};