import { Owner } from "../models/owner.models.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")

        if (!token) throw apiError(401, "UNAUTHORIZED REQUEST");
        // console.log(token)
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken)
        const owner = await Owner.findById(decodedToken._id).select("-password -refreshToken")
        if (!owner) throw apiError(401, "UNAUTHORIZED REQUEST");
        req.owner = owner;
        next();

    } catch (error) {
        throw new apiError(401, error?.message || "INVALID  ACCESS TOKEN");
    }
}
export { verifyJwt }