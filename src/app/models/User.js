import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  role: { type: String, default: "user" },
}, {
  timestamps: true
});

UserSchema.index({ email: 1 });

export const User = models?.User || model('User', UserSchema);