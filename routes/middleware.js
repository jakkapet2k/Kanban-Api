const AuthenUtil = require('../util/authenUtil');

const unauthenticatedPaths = {
  '/api/login': ['POST'],
  '/api/register': ['POST'],
};

const userRoutes = [
  '/api/invite',
  '/api/board-members',
  '/api/users',
  '/api/users/:id',
  '/api/boards',
  '/api/boards/:id',
  '/api/columns',
  '/api/columns/:id',
  '/api/tasks',
  '/api/tasks/:id',
];

const adminRoutes = []; // Add your admin routes here if needed

const isRouteAllowed = (path, routes) => {
  return routes.some(route => {
    const regex = new RegExp(`^${route.replace(/:[^\s/]+/g, '[^/]+')}$`);
    return regex.test(path);
  });
};

const middleWare = async (req, res, next) => {
  try {
    console.log(`CALL AT -->[${req.path}]`);

    const unauthenticatedPath = Object.keys(unauthenticatedPaths).find(path => req.path.startsWith(path));
    if (unauthenticatedPath && unauthenticatedPaths[unauthenticatedPath].includes(req.method)) {
      return next();
    }

    const jwtStatus = AuthenUtil.checkAuthentication(req);
    if (!jwtStatus) {
      throw new Error("login_expired");
    }

    const issuedAtDateUTC = new Date(jwtStatus.iat * 1000);
    const expirationDateUTC = new Date(jwtStatus.exp * 1000);
    const logObject = {
      username: jwtStatus.username,
      role: jwtStatus.role,
      issuedAt: issuedAtDateUTC.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      expiration: expirationDateUTC.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    };
    console.log('Authentication Log:', JSON.stringify(logObject, null, 2));

    const authenticatedRoutes = jwtStatus.role === 'admin' ? adminRoutes : userRoutes;

    if (!isRouteAllowed(req.path, authenticatedRoutes)) {
      throw new Error("unauthorized_access");
    }

    next();
  } catch (err) {
    console.error("ERROR---->", err.stack || err.message);
    res.status(401).json({ message: err.message === "login_expired" ? "Please log in again" : "Unauthorized access" });
  }
};

module.exports = { middleWare };
