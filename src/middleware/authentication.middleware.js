import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const isAuthentication = asyncHandler(async (req, res, next) => {
    // Check token existence
    const token = req.headers["token"];  // Use 'authorization' header
    if (!token) {
        return next(new Error("Token is required!", { cause: 400 }));
    }
    
 
    // Check bearer key
    const bearerKey = process.env.BEARER_KEY || "Ecommerce__";  // Ensure bearer key is defined
    if (!token.startsWith(bearerKey)) {
        return next(new Error("Valid token is required!", { cause: 400 }));
    }

    // Extract the actual token (remove bearer key)
    const extractedToken = token.split(bearerKey)[1].trim();  // Use split to remove the bearer key
    if (!extractedToken) {
        return next(new Error("Invalid token format!", { cause: 400 }));
    }

    // Verify and extract payload from token
    let payload;
    try {
        payload = jwt.verify(extractedToken, process.env.TOKEN_KEY);
    } catch (error) {
        return next(new Error("Token verification failed!", { cause: 401 }));
    }

    // Check if the token exists in DB and is valid
    const tokenDB = await Token.findOne({ token: extractedToken, isValid: true });
    if (!tokenDB) {
        return next(new Error("Token is invalid or expired", { cause: 401 }));
    }

    // Check user existence
    const user = await User.findById(payload.id);
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // Pass user to the request object
    req.user = user;

    // Continue to the next middleware
    next();
});
