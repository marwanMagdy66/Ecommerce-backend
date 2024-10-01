import { User } from "../../../DB/models/user.model.js";
import { Token } from "../../../DB/models/token.model.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmails.js";
import randomstring from "randomstring";
import { Cart } from "../../../DB/models/cart.js";
export const register = asyncHandler(async (req, res, next) => {
  const { email, userName, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new Error("email already existed", { cause: 409 }));
  if (password != confirmPassword) {
    return next(new Error("password must be same ", { cause: 409 }));
  }


  //generate Token
  const token = jwt.sign({ email }, process.env.TOKEN_KEY);

  //create user

  await User.create({ ...req.body }); // create >> behind the scene call save()
  
  //create confirmation link
  const confirmationLink = `http://localhost:3000/auth/activate_account/${token}`;

  //send email
  const messageSent = await sendEmail({
    to: email,
    subject: "Activate Account",
    html: confirmationLink,
  });
  if (!messageSent)
    return next(new Error("message not sent to email for verify Email"));
  //send response
  return res.status(201).json({ success: true, message: "check your email !" });
});

export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.TOKEN_KEY);
  const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });
  if (!user) return next(new Error("user Not Found"));
  // create Cart  
  await Cart.create({ userId: user._id });

  //send response
  return res.json({ success: true, message: "Try to login !" });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found "));
  }
  if (!user.isConfirmed) {
    return next(new Error("you must verify your email"));
  }
  const checkPassword = bcryptjs.compareSync(password, user.password);
  if (!checkPassword) return next(new Error("wrong password !"));
  const token = jwt.sign({ email, id: user._id }, process.env.TOKEN_KEY);
  await Token.create({ token, user: user._id });

  return res.json({
    success: true,
    message: "you are logged in successfully !",
    token: { token },
  });
});

export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new error("user not found "), { cause: 404 });
  const code = randomstring.generate({
    charset: "numeric",
    length: 5,
  });
  user.forgetCode = code;
  await user.save();
  const messageSent = await sendEmail({
    to: email,
    subject: "Reset  Password",
    html: code,
  });
  if (!messageSent) return next(new Error("message not sent to email "));

  return res.json({ success: true, message: "code sent to your email " });
});


export const resetPassword=asyncHandler(async(req,res,next)=>{
  const {email,forgetCode,newPassword,confirmPassword}=req.body
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found "));
  }
if(user.forgetCode!=forgetCode)
  return next(new Error("code is invalid for change your password"));
if(newPassword!==confirmPassword)
  
  return next(new Error("password not match"));
const hashpassword=bcryptjs.hashSync(newPassword,parseInt(process.env.SALT_ROUND));
user.password=hashpassword;
await user.save();


// find all token of the user 

const tokens = await Token.find({user:user._id})
tokens.forEach(async(token)=>{
  token.isValid=false;
  await token.save();
})


return res.json({success:true,message:"your password updated successfully !"})




})