import mongoose, { connect, Schema } from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("DB connected successfully!"))
    .catch(() => console.log('failed to connect DB!'));
};
