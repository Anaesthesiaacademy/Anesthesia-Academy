import mongoose from "mongoose";
import Video from "./Video";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  count: { type: Number },
  thumbnail: { type: Object, required: true },
});

CourseSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc._id) {
    try {
      const res = await Video.deleteMany({ courseId: doc._id });

      console.log(`✅ result ${res}`);

      console.log(`✅ Deleted all videos for course ${doc._id}`);
    } catch (error) {
      console.error(
        `❌ Failed to delete videos for course ${doc._id}:`,
        error.message
      );
    }
  }
});

CourseSchema.index({ count: 1 });

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
