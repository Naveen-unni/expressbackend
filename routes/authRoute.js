const express=require("express");
const router=express.Router();
const auth=require('../middleware/auth');
const {regUser,loginUser,loginout,profile}=require("../controller/usercontroller")

router.post("/register",regUser);
router.post("/login",loginUser);
router.get("/profile",auth,(req,res)=>{
res.status(200).json({mesage:"Access grained",user:req.user})
});

router.post('/logout',loginout );

router.get('/me',profile);

module.exports=router;   