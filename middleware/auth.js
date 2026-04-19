const jwt =require("jsonwebtoken");

const auth=(...roles) => async(req,res,next)=>{
try{
const authorize=  req.cookies?.token || req.headers.authorization;

if (!authorize||!authorize.startsWith("Bearer ")){
   return res.status(401).json({messsage:"No token provided"});
}
const token=authorize.split(" ")[1];

const decode =jwt.verify(token,process.env.JWT_SECRET);




    const { data: user, error } = await supabase
      .from('users')
      .select('id,username, role, ')
      .eq('id', decode)
      .single();

    if (error || !user)
      return res.status(401).json({ error: 'User not found' });

 if (roles.length && !roles.includes(user.role))
      return res.status(403).json({
        error: `Access denied. Required: ${roles.join(' or ')}`,
      });

  req.user = user;     

next();

}catch(err){
 return res.status(401).json({ message: "Invalid or expired token" });
}

}

module.exports=auth;