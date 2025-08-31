import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Course" },
  title: { type: String, required: true },
  description: { type: String },
  video: { type: Object, required: true },
  view: { type: Number },
  thumbnail: { type: Object, required: true },
});

VideoSchema.index({ count: 1 });
VideoSchema.index({ courseId: 1 });
export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
