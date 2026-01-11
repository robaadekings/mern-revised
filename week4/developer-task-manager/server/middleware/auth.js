const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token

exports.protect = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))  return res.status(401).json({message: 'Unauthorized'});

    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({message: 'Invalid token'});
    }
};

//checks role

exports.authorize = (role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) 
            return res.status(403).json({message: 'Forbidden'});
        next();
        
    };
};