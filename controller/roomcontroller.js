const supabase = require("../config/db");

const makeroom= async (req, res) => {
  try {
    const { name, expiresInDays } = req.body;

    if (!name)
      return res.status(400).json({ error: 'Room name required' });

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86_400_000).toISOString()
      : null;

    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        name:              name.trim(),
        teacher_id:        req.user.id,   
        invite_expires_at: expiresAt,
      })
      .select('id, name, invite_code, invite_expires_at, status, created_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      roomId:    room.id,
      name:      room.name,
      joinLink:  `${process.env.BASE_URL}/join?code=${room.invite_code}`,
      expiresAt: room.invite_expires_at,
      status:    room.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

const newlink=async (req, res) => {
  try {

    const { data: room, error } = await supabase
      .from('rooms')
      .update({ invite_code: crypto.randomUUID() })
      .eq('id', req.params.roomId)
      .select('invite_code')
      .single();

    if (error) throw error;

    res.json({
      message:  'Invite code rotated — old link is now invalid',
      joinLink: `${process.env.BASE_URL}/join?code=${room.invite_code}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rotate code' });
  }
};

const studentjoin= async (req, res) => {
  try {
    const { code } = req.body;

    if (!code)
      return res.status(400).json({ error: 'Invite code required' });

    const { data: room, error } = await supabase
      .from('rooms')
      .select('id, name, invite_expires_at, status')
      .eq('invite_code', code)
      .single();

    if (error || !room)
      return res.status(404).json({ error: 'Invalid invite code' });

    if (room.status !== 'active')
      return res.status(400).json({ error: 'This room is no longer active' });

    if (room.invite_expires_at && new Date(room.invite_expires_at) < new Date())
      return res.status(410).json({ error: 'This invite link has expired' });


    const { error: enrollError } = await supabase
      .from('room_enrollments')
      .upsert(
        { room_id: room.id, student_id: req.user.id },
        { onConflict: 'room_id,student_id', ignoreDuplicates: true }
      );

    if (enrollError) throw enrollError;

    

    res.json({ message: `Joined room: ${room.name}`, roomId: room.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join room' });
  }
};


module.exports={
makeroom,
newlink,
studentjoin

};