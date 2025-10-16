const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MONGO_URI should be defined in .env as your MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
