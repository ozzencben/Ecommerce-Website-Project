const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  const MAX_RETRIES = 5; // Bağlantı denemesi sayısı
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      await mongoose.connect(MONGO_URI); // artık useNewUrlParser ve useUnifiedTopology gereksiz
      console.log("MongoDB connected");
      break; // bağlantı başarılıysa döngüden çık
    } catch (err) {
      attempts++;
      console.error(
        `MongoDB connection attempt ${attempts} failed:`,
        err.message
      );
      if (attempts < MAX_RETRIES) {
        console.log("Retrying in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 saniye bekle
      } else {
        console.error("Could not connect to MongoDB after maximum attempts.");
        process.exit(1); // bağlantı sağlanamazsa app'i kapat
      }
    }
  }
};

// Connection eventleri
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected!");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected!");
});

module.exports = connectDB;
