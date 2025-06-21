import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePictureUrl: { type: String },
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.passwordHash;
    return userObject;
}


const UserModel = mongoose.model('User', userSchema);

export default UserModel;
