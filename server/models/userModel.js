import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true, min: 8, max: 1024 },
});

const User = mongoose.model("User", userSchema);

export default User;
