import mongoose from "mongoose";
import UserModel from "../models/user.model";

export const userIdExists = async (userId: string | undefined) => {
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        const userExists = await UserModel.exists({ _id: userId });
        return userExists !== null;
    }
    return false;
};