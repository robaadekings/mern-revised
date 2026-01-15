const User = require('../models/User');


// Register a new user

const registerUser = async (req, res) => {
    const { username } = req.body;

    try {
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username });
            await user.save();
            console.log('User saved:', user);
        }
        return res.status(201).json({ user });
            
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser };