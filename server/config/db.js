const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  // mongoose
  //         .connect(uri)
  //         .then(() => {
  //             console.log("Connected to Database");
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //         })

  try {
    await mongoose.connect(uri);
    console.log(mongoose.connection.readyState); // 1 for active connection
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed : ", err.message);
    throw err;
  }
};

module.exports = connectDB;
