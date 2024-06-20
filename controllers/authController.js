const User = require('../models/User');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

const jwtUtils = require('../utils/jwtUtils');
const dotenv = require('dotenv');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../validators/authValidators');

dotenv.config();

exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
  }
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Email is already registered' }] });
    }

    // Generate a unique confirmation token
    const token = jwtUtils.signToken({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Prepare the confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Confirmation',
      text: `Please confirm your account by clicking the following link: ${process.env.BASE_URL}/confirm/${token}`
    };

    // Send the confirmation email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Failed to send confirmation email:', error);
        return res.status(500).json({ errors: [{ msg: 'Failed to send confirmation email' }] });
      }

      // Save the user to the database with inactive status
      user = new User({
        name,
        email,
        password: '', // Empty password for now, will be hashed in the next step
        isConfirmed: false // Assuming you have a field to track email confirmation status
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Respond with a success message after email is sent and user is saved
      res.status(200).json({ message: 'Confirmation email sent. Please check your email to activate your account.' });
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the confirmation token
    const decoded = jwtUtils.verifyToken(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Find the user by email and update confirmation status
    const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    res.json({ msg: 'Email confirmed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res, next) => {
  // Validate request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // No user found with the provided email
      return res.status(400).json({ errors: [{ msg: 'Email not found' }] });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Passwords do not match
      return res.status(400).json({ errors: [{ msg: 'Password incorrect! Please enter the correct password' }] });
    }

    // Passwords match, generate JWT token
    const token = jwtUtils.signToken({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: 3600 });
    // Respond with token, user details, and success status
    res.status(200).json({ token, user, status: 'Logged in successfully' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ msg: 'You are logged out' });
};

exports.setup2FA = async (req, res) => {
  const user = await User.findById(req.user.id);
  const secret = speakeasy.generateSecret();
  user.twoFactorSecret = secret.base32;
  await user.save();
  res.json({ secret: secret.otpauth_url });
};

exports.verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token
  });
  if (verified) {
    res.json({ msg: '2FA verification successful' });
  } else {
    res.status(400).json({ msg: 'Invalid 2FA token' });
  }
};

// reset password 

dotenv.config();

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const { error } = Joi.object({ email: Joi.string().email().required() }).validate({ email });
  if (error) {
    return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const token = jwtUtils.signToken({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Prepare password reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Please click the following link to reset your password: ${process.env.BASE_URL}/reset-password/${token}`
    };

    // Send password reset email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send password reset email' });
      }
      res.json({ message: 'Password reset email sent' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const { error } = resetPasswordSchema.validate({ token, newPassword });
  if (error) {
    return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
  }

  try {
    // Verify reset token
    const decoded = jwtUtils.verifyToken(token, process.env.JWT_SECRET);

    // Find user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save updated password
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};
