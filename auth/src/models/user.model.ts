import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    bio: String,
    passwordHash: String,
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
