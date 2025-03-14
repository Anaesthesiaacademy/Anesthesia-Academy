import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  playlistId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  count: { type: Number },
  thumbnail: { type: String },
});

CourseSchema.index({ count: 1 });
export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
