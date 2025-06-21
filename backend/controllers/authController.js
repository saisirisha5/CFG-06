const Admin = require('../models/Admin');
const Counsellor = require('../models/Counsellor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerCounsellor = async (req, res) => {
  const { email, password, address, phone } = req.body;

  try {
    const counsellorExists = await Counsellor.findOne({ email });

    if (counsellorExists) {
      return res.status(400).json({ message: 'Counsellor already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const counsellor = await Counsellor.create({
      email,
      password: hashedPassword,
      address,
      phone,
    });

    if (counsellor) {
      res.status(201).json({
        _id: counsellor._id,
        email: counsellor.email,
        token: generateToken(counsellor._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid counsellor data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginCounsellor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const counsellor = await Counsellor.findOne({ email });

    if (counsellor && (await bcrypt.compare(password, counsellor.password))) {
      res.json({
        _id: counsellor._id,
        email: counsellor.email,
        token: generateToken(counsellor._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  registerCounsellor,
  loginCounsellor,
}; 