import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);


