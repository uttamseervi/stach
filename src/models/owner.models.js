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
    },
    refreshToken: {
        type: String
    }

})

ownerSchema.pre("save", async function (next) {
    // console.log("before hasing", this.password)
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

ownerSchema.methods.isPasswordCorrect = async function (password) {
    // console.log("after hashinf", this.password);
    return await bcrypt.compare(password, this.password);
}

ownerSchema.methods.generateAccessToken = async function () {
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

ownerSchema.methods.generateRefreshToken = async function () {
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
export const Owner = mongoose.model("Owner", ownerSchema)