const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const secretKey = process.env.JWT_SECRET || 'PRAV2004';

router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: username, email, password",
        });
      }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (password.length > 6) {
        return res.status(400).json({ success:false, message: 'Password must not be greater than 6 characters' });
      }
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with that email already exists.",
        });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ username, email, password:hashedPassword });
      await newUser.save(); 
      console.log("User Created :",newUser);
      res.status(200).json({ success: true, message: "User registered successfully." });
    } catch (error) {
      console.error("Error in registration: ", error);
      res.status(500).json({ success: false, message: "Registration failed." });
    }
  });
  
  // Login 
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userExist = await User.findOne({ email });
  
      if (!userExist) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
      }
      // match password
      const passwordMatch = await bcrypt.compare(password, userExist.password);
     
      if (passwordMatch) {
        const token = jwt.sign({ userId: userExist._id, email: userExist.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: "User login successfully.",token });
        console.log("Login successsfully ");
      } else {
        res.status(401).json({ success: false, message: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error in login: ", error);
      res.status(500).json({ success: false, message: "Internal server error login." });
    }
  });
  
//   export krna jaruri hai 
  module.exports = router;