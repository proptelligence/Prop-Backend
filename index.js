const express = require("express");
const cors = require("cors");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to the SQLite database
const db = new sqlite3.Database("users.db");

// Create a users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      mobile TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
});

// Endpoint to handle user registration
app.post("/register", async (req, res) => {
  const { name, mobile, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user data into the database
  db.run(
    "INSERT INTO users (name, mobile, email, password) VALUES (?, ?, ?, ?)",
    [name, mobile, email, hashedPassword],
    (err) => {
      if (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Failed to register user" });
        return;
      }
      res.status(200).json({ message: "User registered successfully" });
    }
  );
});

// Endpoint to handle user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve user from the database based on the email
  db.get(
    "SELECT * FROM users WHERE email = ?",
    [username],
    async (err, row) => {
      if (err) {
        console.error("Error finding user:", err);
        res.status(500).json({ error: "Error finding user" });
        return;
      }

      if (!row) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Compare passwords
      const match = await bcrypt.compare(password, row.password);

      if (!match) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.status(200).json({ message: "Login successful" });
    }
  );
});


app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("Error getting user data:", err);
      res.status(500).json({ error: "Error getting user data" });
      return;
    }
    res.status(200).json({ users: rows });
  });
});





// Start the server
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});