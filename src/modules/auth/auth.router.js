import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as authController from './auth.controller.js'
import * as authSchema from './auth.schema.js'

const router=Router();


//signUp
router.post('/register',validation(authSchema.register),authController.register)


//Activate Account 
router.get('/activate_account/:token',validation(authSchema.acctivate),authController.activateAccount)

//login
router.post('/login',validation(authSchema.login),authController.login)


// send forget Code
router.patch('/forgetCode',validation(authSchema.forgetCode),authController.forgetCode)



//reset password
router .patch('/resetPassword',validation(authSchema.resetPassword),authController.resetPassword)



export default router;