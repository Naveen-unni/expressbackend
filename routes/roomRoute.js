const express     = require('express');
const auth  = require('../middleware/auth');
const isRoomOwner = require('../middleware/isroomowner');
const router2      = express.Router();

const {makeroom,newlink,studentjoin}=require('../controller/roomcontroller')


router2.post('/', auth('teacher'),makeroom);


router2.get('/:roomId', auth('teacher'), isRoomOwner, (req, res) => {
  res.json({
    ...req.room,
    joinLink: `${process.env.BASE_URL}/join?code=${req.room.invite_code}`,
  });
});




router2.patch('/:roomId/rotate-code', auth('teacher'), isRoomOwner,newlink );



router2.post('/join', auth('student'),studentjoin);



module.exports = router2;