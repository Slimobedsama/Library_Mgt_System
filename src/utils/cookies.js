const setSignedCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000,
    };
  
    res.cookie(name, value, { ...defaultOptions, ...options });
  };

export default setSignedCookie;