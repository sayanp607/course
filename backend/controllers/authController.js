const { createUser, findUserByEmail } = require('../models/user');
const bcrypt = require('bcrypt');

// Signup
async function signup(req, res) {
  const { name, email, password, role } = req.body;
  console.log('Signup request body:', req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(name, email, hashedPassword, role);
    res.status(201).json({ user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({ error: 'User already exists or invalid data.', details: err.message });
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;
  console.log('Login request body:', req.body);
  const user = await findUserByEmail(email);
  if (!user) {
    console.log('Login error: User not found for email', email);
    return res.status(404).json({ error: 'User not found' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log('Login error: Invalid password for email', email);
    return res.status(401).json({ error: 'Invalid password' });
  }
  console.log('Login success for user:', user.email);
  // Store role in localStorage on frontend after successful login
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

module.exports = { signup, login };
