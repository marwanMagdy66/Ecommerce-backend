import Joi from "joi";

//register

export const register = Joi.object({
userName:Joi.string().min(3).max(15).required(),
email: Joi.string().email().required(),
password:Joi.string().required(),
confirmPassword:Joi.string().required().valid(Joi.ref("password"))

}).required();



//activate account 
export const acctivate=Joi.object({
token:Joi.string().required()
}).required();



//login 

export const login=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
}).required();


// forget code 

export const forgetCode=Joi.object({
    email:Joi.string().email().required(),
    

})
.required()

//reset Password
export const resetPassword=Joi.object({
    email:Joi.string().required().email(),
    forgetCode:Joi.string().required().length(5),
    newPassword:Joi.string().required(),
    confirmPassword:Joi.string().required().valid(Joi.ref('newPassword'))
})