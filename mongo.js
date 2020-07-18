const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("USAGE: node mongo.js <password> <name> <phonenumber>");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://casualedd:${password}@cluster0-o8mxt.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

const Contact = mongoose.model("Contact", phonebookSchema);

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}

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
