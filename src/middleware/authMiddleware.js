const jwt = require('jsonwebtoken');
const { promisify } = require('util')
const User = require('../model/userModel');
const { gEnv } = require('../utils/env');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: "No token, authorization denied"
        })
    }
    try {
        const decode = await promisify(jwt.verify)(token, gEnv('JWT_SECRET'));
        req.user = await User.findById(decode.userID);
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authMiddleware;