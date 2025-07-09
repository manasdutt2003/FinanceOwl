import express from 'express'
import { getUserInfo,registerUser,loginUser,logoutUser } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'
const router=express.Router()

router.get('/getUser',protect,getUserInfo);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout', protect, logoutUser);

export default router;