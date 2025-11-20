import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
} from '../emails/emailHandlers.js';
import { ENV } from '../lib/env.js';
import crypto, { verify } from 'crypto';
import cloudinary from '../lib/cloudinary.js';

// -----------------------------------SIGNUP---------------------------------------------------

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } =
      req.validatedData.body;
    // 2. Unique mail check

    const mailCheck = await User.findOne({ email });
    if (mailCheck) {
      return res.status(409).json({ message: 'Email already exist' });
    }

    // 3. Unique username check

    const userNameCheck = await User.findOne({ userName });

    if (userNameCheck) {
      return res.status(409).json({ message: 'Username already exist' });
    }

    // 4. Password hash

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5.verify mail token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 6. Create new User

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      const verifyURL = `${ENV.CLIENT_URL}/verify-email?token=${verificationToken}`;

      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        email: newUser.email,
      });

      //invio mail

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.firstName, verifyURL);
      } catch (error) {
        console.error('failed to send welcome email', error);
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('error in signup controller:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

//---------------------------- VERIFICA MAIL-----------------------------

export const verifyMail = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token mancante' });
  }
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Token non valido o scaduto' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verificata con successo' });
  } catch (error) {
    console.log('errore verifica mail', error);
    res.status(500).json({ message: 'errore nella registrazione' });
  }
};

//-----------------------------LOGIN----------------------------------------

export const login = async (req, res) => {
  const { email, password } = req.validatedData.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'email not verified' });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    console.error('error in login controller');
    res.status(500).json({ message: 'Internal error' });
  }
};

//--------------------------------LOGOUT-----------------------------------

export const logout = async (_, res) => {
  res.cookie('jwt', '', { maxAge: 0 }); // nome scelto in generateToken in res.cookie
  res.status(200).json({ message: 'logout successfully' });
};
//  -----------------------------------PASSWORD RESET---------------------------------------------

export const passwordResetRequest = async (req, res) => {
  const { email: rawEmail } = req.body;
  const email = rawEmail?.trim().toLowerCase();
  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: 'email errata' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'utente non trovato' });
    }

    // token for reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
    await user.save();

    // reset link

    const resetURL = `${ENV.CLIENT_URL}/reset-password?token=${resetToken}`;

    //invio mail

    await sendResetPasswordEmail(user.email, user.firstName, resetURL);

    res.json({ message: 'Reset mail inviata' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal error' });
  }
};

export const passwordReset = async (req, res) => {
  const { token, newPassword } = req.validatedData;
  try {
    // cerco utente tramite token non scaduto
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'token non valido o scaduto' });
    }

    // password update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    //  invalid reset token

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'password aggiornata con successo' });
  } catch (error) {
    console.error('errore reset password', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//---------------------UPDATE PROFILE-----------------------

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: 'profilePic mancante' });
    }

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error('errore aggiornando profilo', error);
    res.status(500).json({ message: 'internal error' });
  }
};

//---------------------AUTH USER FOR CHECK AUTH-----------------------
export const checkAuth = (req, res) => {
  try {
    // req.user esiste perché il middleware protectRoute ce l'ha messo
    console.log('CheckAuth riuscito per:', req.user.userName);
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Errore nel controller checkAuth', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//---------------------RESEND VERIFICATION EMAIL-----------------------
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.validatedData.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'utente non trovato' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email già verificata' });
    }
    // Genera nuovo token di verifica
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const verifyURL = `${ENV.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Invia l'email di verifica
    try {
      await sendWelcomeEmail(user.email, user.firstName, verifyURL);
      res.json({ message: 'Email di verifica inviata nuovamente' });
    } catch (error) {
      console.error('failed to send verification email', error);
      res.status(500).json({ message: 'Errore invio email di verifica' });
    }

    res.json({ message: 'Email di verifica inviata nuovamente' });
  } catch (error) {
    console.error('errore nel resend verification email', error);
    res.status(500).json({ message: 'internal error' });
  }
};
