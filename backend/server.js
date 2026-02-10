const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Environment variables
const PORT = process.env.PORT || 10000; // Render requires process.env.PORT
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/aeroglassstore";
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// 🔗 Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 📦 Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cart: [
    {
      name: String,
      price: Number,
      qty: Number,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

// 🔑 Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, cart: [] });
    await user.save();
    res.json({ message: "Account created!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ error: "Username already exists" });
  }
});

// 🔑 Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🛒 Save Cart
app.post("/cart", async (req, res) => {
  const { token, cart } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cart = cart;
    await user.save();
    res.json({ message: "Cart saved!" });
  } catch (err) {
    console.error("Save cart error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// 🛒 Load Cart
app.get("/cart", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Load cart error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// 🌍 Health Check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ▶️ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
