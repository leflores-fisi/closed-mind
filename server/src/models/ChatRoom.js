const mongoose = require('mongoose')

// The schemas are to application level
const chatRoomSchema = new mongoose.Schema({
  code: String,
  host: String,
  created_date: String,
  is_open: Boolean,
  users: [{ user_id: String }],
  messages: [{ from: String, text: String, date: String }]
});
chatRoomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const sessionSchema = new mongoose.Schema({
//   code: String,
//   host: String,
//   created_date: Date,
//   is_open: Boolean,
//   users: [{ username: String }],
//   messages: [{ username: String, message: String, date: Date }]
// });


// sessionSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// We define the model to instantiate the sessionSchema
// Also is the name of the mongoDB collection on CamelCase: Session -> session
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
