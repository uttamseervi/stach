import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
    contactNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    cart: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
    },
    orders: {
        type: Array,
        default: [],
    },

})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET
        ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET
        ,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)