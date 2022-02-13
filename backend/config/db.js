const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = connectionDB;
