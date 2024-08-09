import mongoose, { Schema, Document } from "mongoose";

// message Schema
export interface Messages extends Document {
  content: string;
  createdAt: Date;
}
const messageSchema: Schema<Messages> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// user Schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Messages[];
}

// To create the regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [emailRegex, "Invalid email address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpire: {
    type: Date,
    required: [true, "Verify code expire is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages:[messageSchema],

});

// To export the model
export const Message = mongoose.models.Message as mongoose.Model<Messages> || mongoose.model<Messages>("Message", messageSchema);
export const User = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);
