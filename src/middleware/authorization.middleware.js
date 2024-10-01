export const isAuthorized = (...roles)=>{
return async (req,res,next)=>{
    //check user role
    if(!roles.includes(req.user.role))return next(new Error("not Authorized !"),{cause:403})
    
return next();
}
}