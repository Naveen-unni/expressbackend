const {reguser,loginuser}=require("../service/userservice");

const regUser=async(req,res)=>{
    try{ 
const{username,password}=req.body;
const user=await reguser(username,password);
 return res.status(201).json({ message: "User registered successfully", user });
}catch(err){
     return res.status(400).json({ message: err.message });
}

};

const loginUser=async(req,res)=>{
    try{
const{username,password}=req.body;
const user=await loginuser(username,password);
return res.status(200).json({ message: "Login successful", user });
    
}catch(err){
return res.status(401).json({ message: err.message });
}
};

const loginout=(req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

const profile= async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(' ')[1];

    if (!token)
      return res.status(401).json({ error: 'Not authenticated' });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, username, role')
      .eq('id', id)
      .single();

    if (error || !user)
      return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
module.exports={
    regUser,
    loginUser,
    loginout,
    profile
};