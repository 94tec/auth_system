const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { registerValidation, loginValidation, validateFields } = require('../validators/authValidators');
const { ensureAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerValidation, validateFields, authController.register);
router.get('/confirm/:token', authController.confirmEmail);
router.post('/login', loginValidation, validateFields, authController.login);
router.get('/logout', authController.logout);
router.post('/2fa/setup', ensureAuthenticated, authController.setup2FA);
router.post('/2fa/verify', ensureAuthenticated, authController.verify2FA);

// Route for requesting password reset
router.post('/forgot-password', authController.forgotPassword);

// Route for resetting password
router.post('/reset-password', authController.resetPassword);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

module.exports = router;
