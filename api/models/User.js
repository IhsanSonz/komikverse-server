import { Schema, model } from "mongoose";
const schema = Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model("user", UserSchema);