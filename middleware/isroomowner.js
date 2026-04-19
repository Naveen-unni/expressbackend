const supabase = require('../config/db');

const isRoomOwner = async (req, res, next) => {
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', req.params.roomId)
      .single();

    if (error || !room)
      return res.status(404).json({ error: 'Room not found' });

    if (room.teacher_id !== req.user.id)
      return res.status(403).json({ error: 'You do not own this room' });

    req.room = room;
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports=isRoomOwner ;