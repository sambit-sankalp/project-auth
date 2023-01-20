import User from './userModel.js';
import generateToken from './generateToken.js';
import { decrypt, encrypt } from './encryptAndDecrypt.js';

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: encrypt(email) });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: decrypt(user.name),
      mobile: decrypt(user.mobile),
      email: decrypt(user.email),
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    res.send('Invalid email or password');
  }
};

const registerUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  const userExists = await User.findOne({ email: encrypt(email) });

  if (userExists) {
    res.status(400);
    res.send('email or password already exists');
  } else {
    const user = await User.create({
      name: encrypt(name),
      mobile: encrypt(mobile),
      email: encrypt(email),
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: decrypt(user.name),
        mobile: decrypt(user.mobile),
        email: decrypt(user.email),
        token: generateToken(user._id),
      });
    } else {
      res.status(404);
      res.send('Error creating user');
    }
  }
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (req.body.name) user.name = encrypt(req.body.name);
    else user.name = user.name;

    if (req.body.email) user.email = encrypt(req.body.email);
    else user.email = user.email;

    if (req.body.mobile) user.mobile = encrypt(req.body.mobile);
    else user.mobile = user.mobile;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: decrypt(updatedUser.name),
      email: decrypt(updatedUser.email),
      mobile: decrypt(updatedUser.mobile),
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

const resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.params.id);

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
  } else {
    res.status(401);
    res.send('Password is not correct');
  }

  const updatedPassword = await user.save();
  if (updatedPassword) {
    res.status(201).send('Password updated');
  }
};

export { authUser, registerUser, updateUser, resetPassword };
