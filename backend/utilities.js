// const jwt = require('jsonwebtoken')

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token  = authHeader && authHeader.split("")[1];

//     if(!token)  return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
//         if(err) return res.sendStatus(401);
//         req.user = user;

//         next();
//     })
// }

// module.exports = {
//     authenticateToken,
// }

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
            }
            return res.status(403).json({ error: true, message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
};
