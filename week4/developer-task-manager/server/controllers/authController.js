const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sign up a new user

exports.signup = async (req, res) => {
    const {email, password} = req.body;

    const exist = await User.findOne({email});
    if (exist) return res.status(400).json({message: 'User already exists'});
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({email, password: hashed});

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);


};

// Log in an existing user

exports.login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(404).json({message: 'User does not exist'});

    const Match = await bcrypt.compare(password, user.password);
    if (!Match) return res.status(401).json({message: 'Invalid credentials'});

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);

    res.json({token});
};