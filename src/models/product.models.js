import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    productName: {
        type: String,
        required: true,
        lowercase: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
    bgColor: {
        type: String
    },
    panelColor: String,
    textColor: String,
})

export const Product = mongoose.model("Product", productSchema);