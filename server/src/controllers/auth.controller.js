import userSchema from '../validation/userSchema.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
  // 1. Zod Validation
  try {
    const filteredData = userSchema.safeParse(req.body);
    if (!filteredData.success) {
      const errorList = filteredData.error.issues.map((i) => i.message);
      console.log(errorList);
      return res.status(400).json({ message: errorList });
    }

    const { firstName, lastName, userName, email, password } =
      filteredData.data;
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

    // 5. Create new User

    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();

      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('error in signup controller:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};
