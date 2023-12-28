const express = require('express');
const router = express.Router();
const User = require('../models/user')
router.get('/users', async (req, res) => {
    try {
      const users = await User.find({},{password:0});
      if (!users) {
        return res.status(404).json({ success: false, message: 'Users not found' });
      }
      res.status(200).json({users});
    } catch (error) {
      console.error('Error in fetching : ', error);
      res.status(500).json({ success: false, message: 'Internal server error fetching .' });
    }
  });
  router.get('/emails', async (req, res) => {
    try {
        const emails = await User.find({}).select('email');
    // const emails = await User.find({}, { _id: 0, username: 0, password: 0, __v: 0 });   long hai
      if (!emails) {
        return res.status(404).json({ success: false, message: 'emails not found' });
      }
      res.status(200).json({emails});
    } catch (error) {
      console.error('Error in fetching : ', error);
      res.status(500).json({ success: false, message: 'Internal server error  .' });
    }
  });
//   export krna jaruri hai 
  module.exports = router;