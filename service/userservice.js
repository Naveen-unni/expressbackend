const jwt = require("jsonwebtoken");
const {register,login}=require('../model/usermodel')
const bcrypt = require("bcrypt");

const reguser=async(username,password)=>{
 if (!username || !password) throw new Error("All fields are required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

    if (username) {
      const { data } = await supabase
        .from('users')
        .select('id')
        .ilike('username', email.trim())
        .single();

      if (data)
        return res.status(409).json({ error: 'username already registered' });
    }

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
        id:data.id,username:data.username
    },process.env.JWT_SECRET,
    {expiresIn:"7d"}
)
 res.cookie('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   24 * 60 * 60 * 1000,
    });

return{token};

}

module.exports={reguser,loginuser};