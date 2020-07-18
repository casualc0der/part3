const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.log("error connecting to mongoDB", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", phonebookSchema);

//get//
if (process.argv.length === 3) {
}

//post
if (process.argv.length === 5) {
  const contact = new Contact({
    name: name,
    number: number,
    date: new Date(),
  });
  contact.save().then((result) => {
    console.log("contact saved!");
    mongoose.connection.close();
  });
}
// const note = new Note({
// 	content: 'oh, hi Edd!',
// 	date: new Date(),
// 	important: true,
// })

// note.save().then(result => {
// 	console.log('note saved!')
// 	mongoose.connection.close()
// })

// when using the find method, pass in an empty object to
// retrieve all entries in the db table
