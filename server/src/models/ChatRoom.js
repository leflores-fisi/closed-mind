const mongoose = require('mongoose');

// The schemas are to application level
const chatRoomSchema = new mongoose.Schema({
  code: String,
  host: String,
  created_date: String,
  is_open: Boolean,
  users: [{ user_id: String, color: String }],
  messages: [new mongoose.Schema({
    from: String,
    text: String,
    color: String,
    date: String
  }, {strict: false})]
});
chatRoomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// We define the model to instantiate the sessionSchema
// Also is the name of the mongoDB collection on CamelCase: Session -> session
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
module.exports = ChatRoom;