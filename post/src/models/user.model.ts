import mongoose from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    bio: string;
    profilePictureUrl: string;
    passwordHash: string;
    createdAt: Date;
    role: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePictureUrl: { type: String, default: null },
});

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.passwordHash;
    return userObject;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
