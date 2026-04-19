const express=require("express");
const router1=express.Router();
const auth=require('../middleware/auth');
const  {adminget,adminsearch,adminrole} =require('../controller/adminconroller')

router1.get('/users', auth('admin'),adminget );


router1.get('/users/search', auth('admin'),adminsearch);


router1.patch('/users/:id/role', auth('admin'),adminrole);


module.exports=router1;   