const supabase = require("../config/db");

const adminget=async (req, res) => {
  try {
    const { role } = req.query;

    let query = supabase
      .from('users')
      .select('id, name, username,  role');
      

    if (role) query = query.eq('role', role);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const adminsearch= async (req, res) => {
  try {
    const {  username } = req.query;

    if ( !username )
      return res.status(400).json({ error: 'Provide  username, ' });

    let query = supabase
      .from('users')
      .select('id,  username,  role,')
      .limit(20);

   
    if (username) query = query.ilike('username', `%${username}%`);
    

    const { data, error } = await query;
    if (error) throw error;

    if (!data.length)
      return res.status(404).json({ error: 'No users found' });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
};


const adminrole= async (req, res) => {
  try {
    const { role } = req.body;

    const allowed = ['teacher', 'student'];
    if (!allowed.includes(role))
      return res.status(400).json({ error: 'Role must be teacher or student' });

    if (req.params.id === req.user.id)
      return res.status(400).json({ error: 'You cannot change your own role' });

    
    const { data: target } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.params.id)
      .single();

    if (!target)
      return res.status(404).json({ error: 'User not found' });

    if (target.role === 'admin')
      return res.status(403).json({ error: 'Cannot change role of another admin' });

    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', req.params.id)
      .select('id,  username,  role')
      .single();

    if (error) throw error;

   

    res.json({
      message: `${user.username} is now a ${user.role}`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

module.exports={
    adminget,
    adminsearch,
    adminrole
}
