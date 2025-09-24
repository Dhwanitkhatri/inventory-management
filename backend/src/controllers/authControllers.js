const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User"); 

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: `${email} user not found` });

    // to check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Password is invalid, try again" });

    // Create JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    });

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { login };
