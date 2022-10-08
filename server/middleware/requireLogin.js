const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    try {
        if (req.header('authorization')) {
            const token = req.header('authorization');
            const data = jwt.verify(token, JWT_SECRET_KEY);
            const user = await User.findById(data._id);
            if (user) {
                if (user.isDeactivated) {
                    throw new Error('User is deactivated');
                } else {
                    req.user = user;
                    next();
                }
            } else {
                throw new Error('Invalid token !');
            }
        } else {
            throw new Error('User must be logged in !');
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: error.message });
    }

}	