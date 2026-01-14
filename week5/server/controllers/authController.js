const User = require('../models/User');


// Register a new user

const registerUser = async (req, res) => {
    const { username } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) user = await User.create({ username });
        return res.status(201).json({ user });
            
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };

module.exports = { registerUser };