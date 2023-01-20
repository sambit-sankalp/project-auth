import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  resetPassword,
  updateUser,
} from './userController.js';

router.post('/signup', registerUser);
router.post('/signin', authUser);
router.put('/reset/:id', resetPassword);
router.put('/update/:id', updateUser);

export default router;
