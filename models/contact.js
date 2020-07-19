const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useCreateIndex", true);
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.log("error connecting to mongoDB", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
  date: Date,
});
phonebookSchema.plugin(uniqueValidator);
phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", phonebookSchema);
