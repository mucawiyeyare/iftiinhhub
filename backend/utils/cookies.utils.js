export const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    ...options
  };
  
  res.cookie(name, value, defaultOptions);
};

export const clearCookie = (res, name) => {
  res.clearCookie(name);
};