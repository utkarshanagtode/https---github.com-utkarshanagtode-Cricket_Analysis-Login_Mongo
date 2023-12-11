var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Project").then(() => {
  console.log(`Connected to MongoDB`);
}).catch((e) => {
  console.log(`No Connection: ${e.message}`);
})
