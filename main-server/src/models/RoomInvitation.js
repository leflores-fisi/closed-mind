const mongoose = require('mongoose');

const roomInvitationSchema = new mongoose.Schema({
  invitation_code: String,
  room_code: String,
  room_name: String,
  host: String,
  description: String,
})
roomInvitationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const RoomInvitation = mongoose.model('RoomInvitation', roomInvitationSchema);
module.exports = RoomInvitation;