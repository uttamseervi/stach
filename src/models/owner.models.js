import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const ownerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "PASSWORD IS REQUIRED"],
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [18, "Password cannot exceed 18 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
    },
    product: {
        type: Array,
        default: [],
    },
    gstIn: {
        type: String,
    }

})
export const Owner = mongoose.model("Owner", ownerSchema)