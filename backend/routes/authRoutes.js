const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  registerCounsellor,
  loginCounsellor,
} = require('../controllers/authController');

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/counsellor/register', registerCounsellor);
router.post('/counsellor/login', loginCounsellor);

module.exports = router; 