export const isAuthenticated = (req, res, next) => {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }
};

export const getCurrentUser = async (req, res, next) => {
  if (req.session?.userId) {
    req.userId = req.session.userId;
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated',
    });
  }
};
