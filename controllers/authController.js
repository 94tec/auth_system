const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

const jwtUtils = require('../utils/jwtUtils');
const dotenv = require('dotenv');

dotenv.config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Email is already registered' }] });
    }

    // Generate the JWT token
    const token = jwtUtils.signToken({ user: { id: new User().id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Prepare to send the confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fixtone94tec@gmail.com',
        pass: 'dgsawqvqcjkobbxw'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Confirmation',
      text: `Please confirm your account by clicking the following link: ${process.env.BASE_URL}/confirm/${token}`
    };

    // Attempt to send the email before saving the user
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({ errors: [{ msg: 'Failed to send confirmation email', error }] });
      }

      // If email sent successfully, proceed to save the user
      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      res.status(200).send('Confirmation email sent.');
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const decoded = jwtUtils.verifyToken(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }
    user.isConfirmed = true;
    await user.save();
    res.json({ msg: 'Email confirmed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).send('Server Error');
    }
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) {
        return res.status(500).send('Server Error');
      }
      const token = jwtUtils.signToken({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: 3600 });
      res.json({ token });
    });
  })(req, res, next);
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
