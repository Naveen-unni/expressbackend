const supabase = require("../config/db");



const register=async(username,password)=>{

  
const {data,error}=await supabase
.from('users')
.insert([
    {
        username,
        password
    }
])
.select();

if (error) {
    {
    if (error.code === "23505") throw new Error("Username already taken");
    throw new Error("Registration failed. Please try again.");
  }
}
const { password: _, ...safeUser } = data[0];
  return safeUser;

};


const login= async(username)=>{

const {data,error}=await supabase 
.from('users')
.select("*")
.eq('username',username)
.single()

if(error||!data) throw  new Error ("Invalid credentials");

return data;

};



module.exports={
register,login

};