import { Schema, model } from "mongoose";
const schema = Schema;

const ImageSchema = new schema({
  lang: {
    type: String,
    required: [true, 'Data lang dibutuhkan'],
  },
  chapterId: {
    type: Schema.Types.ObjectId,
    ref: 'chapter',
    required: [true, 'Data chapterId dibutuhkan'],
  },
  index: {
    type: Number,
    required: [true, 'Data index dibutuhkan'],
  },
  image_url: {
    type: String,
    required: [true, 'Data image_url dibutuhkan'],
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model("image", ImageSchema);