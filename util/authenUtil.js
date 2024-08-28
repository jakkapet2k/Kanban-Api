const jwt = require('jsonwebtoken');

// ฟังก์ชันสำหรับสร้าง JWT

exports.getGenerateAccessToken = (payload) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
      throw new Error('JWT secret key is not defined');
  }

  return jwt.sign(payload, secretKey, { expiresIn: '5h' });
};



exports.checkAuthentication = (request) => {
  try {
    let accessToken = request.headers.authorization.split(' ')[1];
    let jwtResponse = jwt.verify(String(accessToken), process.env.JWT_SECRET_KEY);
    return jwtResponse;
  } catch (error) {
    return false;
  }
};
