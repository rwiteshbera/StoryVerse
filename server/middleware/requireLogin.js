const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    try {
        if (req.header('authorization')) {
            const token = req.header('authorization');
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
            User.findById(data._id).then((user) => {
                try {
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
                } catch (error) {
                    console.log(error)
                    res.status(401).json({ error: error.message });
                }
            })
        } else {
            throw new Error('User must be logged in !');
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: error.message });
    }

}	
