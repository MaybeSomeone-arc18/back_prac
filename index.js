const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];

app.get('/search', (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Please provide a name in the query parameter!" });
  }
  res.json({ message: `Hello, ${name}!` });
});

app.post('/users', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "The email isn't in the valid format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password too short!" });
  }


  users.push({ email, password });

  res.status(201).json({
    message: "User created successfully",
    user: { email }
  });
});

app.put('/users/:email', (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.password = password;
  res.json({ message: "Password changed successfully" });
});

app.delete('/users/:email', (req, res) => {
  const { email } = req.params;

  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found!" });
  }

  users.splice(userIndex, 1);
  res.json({ message: "User deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
