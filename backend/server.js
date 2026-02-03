const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/aeroglassstore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 📦 Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
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
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashed, cart: [] });
    await user.save();
    res.json({ message: "Account created!" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// 🔑 Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// 🛒 Save Cart
app.post("/cart", async (req, res) => {
  const { token, cart } = req.body;
  try {
    const decoded = jwt.verify(token, "secretkey");
    const user = await User.findById(decoded.id);
    user.cart = cart;
    await user.save();
    res.json({ message: "Cart saved!" });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// 🛒 Load Cart
app.get("/cart", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secretkey");
    const user = await User.findById(decoded.id);
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
