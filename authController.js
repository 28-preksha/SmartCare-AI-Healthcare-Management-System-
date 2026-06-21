const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Humne single file me jo User schema banaya tha, yeh usi file se link hoga
const User = require('../models/User'); 

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    // Note: User.js model automatically hashes this via pre-save hook
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "Registration successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name }, 
        "JWT_SECRET_KEY", 
        { expiresIn: '1d' }
      );
      res.json({ token, role: user.role, name: user.name });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
  console.error("REGISTER ERROR =>", error);

  res.status(500).json({
    error: error.message
  });
}
};