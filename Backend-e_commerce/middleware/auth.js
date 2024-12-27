const jwt = require('jsonwebtoken');  

const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });  
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);  
        req.adminId = decoded.id;  
        next();  
    } catch (error) {
        console.error('JWT verification failed:', error);  
        res.status(401).json({ message: 'Invalid token' });  
    }
};

module.exports = { verifyAdmin };  