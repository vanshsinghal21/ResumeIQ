import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Error Name:", err.name);
    console.error("❌ Error Code:", err.code);
    console.error("❌ Error Message:", err.message);
    console.error(err);
  }
};

export default connectDB;