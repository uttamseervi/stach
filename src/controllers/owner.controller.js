import { Owner } from "../models/owner.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
// import multer from "multer"

const generateTokens = async (userId) => {
    try {
        const owner = await Owner.findById(userId);
        const refreshToken = await owner.generateRefreshToken();
        const accessToken = await owner.generateAccessToken();
        owner.refreshToken = refreshToken
        await owner.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "SOMETHING WENT WRONG")
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
const createOwner = async (req, res) => {

    const { username, fullName, password, email } = req.body;

    // Validate fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are compulsory");
    }

    // Check if user already exists
    const existingUser = await Owner.findOne({
        $or: [{ username }, { email }]
    });
    if (existingUser) {
        throw new apiError(400, "User with the username or the email already exists");
    }

    // console.log(fullName, email, username, password);

    console.log("The req.file is", req.file);
    const avatarLocalPath = req.file?.path;
    // console.log(avatarLocalPath);

    // Create and save the new owner
    const newOwner = new Owner({
        username,
        fullName,
        password,
        email,
        avatar: avatarLocalPath
    });
    await newOwner.save();
    const createdOwner = await Owner.findById(newOwner._id).select("-password");
    if (!createOwner) throw new apiError(400, "Failed to create a new Owner");
    return res
        .status(200)
        .json
        (
            new apiResponse(200, createdOwner, "owner is created successfully")
        )
};
////////////////////////////////////////////////////////////////////////////////////////////////
const loginOwner = async (req, res) => {
    const { username, email, password } = req.body
    if (!(username && email)) throw new apiError(400, "USERNAME OR EMAIL IS REQUIRED");
    const owner = await Owner.findOne({
        $or: [{ email }, { username }]
    })
    const isPasswordValid = owner.isPasswordCorrect(password);
    if (!isPasswordValid) throw new apiError(500, "password is incorrect");


    if (!owner) throw new apiError(400, "USER NOT EXIST");
    const { accessToken, refreshToken } = await generateTokens(owner._id)

    const loggedInOwner = await Owner.findById(owner._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, loggedInOwner, "Owner Login SuccessFull"));

}
const logoutOwner = async (req, res) => {
    const owner = req.owner;
    await Owner.findByIdAndUpdate(
        req.owner,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out "))
}

const changeOwnerPassword = async (req, res) => {
    //get the old password as well as new one also 
    //verify the old password/
    // save the new password into the database
    const owner = await Owner.findById(req.owner?._id)
    if (!owner) throw apiError(400, "invalid owner");
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) throw new apiError(500, "ALL THE FIELDS ARE COMPULSORY");
    console.log(oldPassword, newPassword)
    const isPasswordValid = await owner.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) throw new apiError(500, "INCORRECT PASSWORD");
    
    owner.password = newPassword;
    await owner.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new apiResponse(200, {}, "PASSWORD CHANGED SUCCESSFULLY"))
}

export { createOwner, loginOwner, logoutOwner, changeOwnerPassword };
