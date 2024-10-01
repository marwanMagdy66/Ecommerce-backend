import {Router} from 'express';
import * as reviewController from './review.controller.js';
import * as reviewSchema from './review.schema.js';
import { isAuthentication } from '../../middleware/authentication.middleware.js';
import { isAuthorized } from '../../middleware/authorization.middleware.js';
import { validation } from '../../middleware/validation.middleware.js';
const router =Router({mergeParams:true})

//add review 
router.post("/add",
    isAuthentication,
    isAuthorized("user"),
    validation(reviewSchema.addReview),
    reviewController.addReview
)

//update review


router.patch("/update/:id",
    isAuthentication,
    isAuthorized("user"),
    validation(reviewSchema.updateReview),
    reviewController.updateReview
)





export default router