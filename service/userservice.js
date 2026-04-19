const jwt = require("jsonwebtoken");
const {register,login}=require('../model/usermodel')
const bcrypt = require("bcrypt");

const reguser=async(username,password)=>{
 if (!username || !password) throw new Error("All fields are required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

const hashpassword=await bcrypt.hash(password,10);
const user=await register(username,hashpassword);

return(user);


}

const loginuser=async(username,password)=>{
if (!username || !password) throw new Error("All fields are required");

const data=await login(username,password)

const isMatch= await bcrypt.compare(password,data.password)
if (!isMatch) throw new Error("Invalid credentials");

const token =jwt.sign(
    {
        id:data,username:data.username
    },process.env.JWT_SECRET,
    {expiresIn:"7d"}
)

return{token};

}

module.exports={reguser,loginuser};