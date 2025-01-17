import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your name'] },
  email: { type: String, required: [true, 'Please enter your email'], unique: true },
  password: { type: String },
  googleId: { type: String },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password && !this.password.startsWith('$2a$')) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }
  next();
});

userSchema.methods.generateResetToken = function () {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  const resetToken = jwt.sign({ userId: this._id }, secret, { expiresIn: '1h' });
  this.resetToken = resetToken;
  this.resetTokenExpiry = Date.now() + 3600000; // Expires in 1 hour
  return resetToken;
};

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;

