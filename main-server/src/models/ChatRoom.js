const mongoose = require('mongoose');

// The schemas are to application level
const UserSchema = new mongoose.Schema({
  user_id: String,
  user_color: String
})
const MessageSchema = new mongoose.Schema({
  message_id: String,
  from: String,
  text: String,
  color: String,
  date: String,
  replyingTo: {
    user: String,
    text: String,
    color: String
  },
  reactions: [{
    emote: String,
    users_list: [String]
  }],
  media: [{
    url: String,
    public_id: String
  }]
}, {strict: false})
const chatRoomSchema = new mongoose.Schema({
  code: String,
  host: UserSchema,
  created_date: String,
  invitations_only: Boolean,
  users: [UserSchema],
  messages: [MessageSchema]
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