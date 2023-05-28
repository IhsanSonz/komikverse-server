import { Schema, model } from "mongoose";
const schema = Schema;

const ChapterSchema = new schema({
  comicId: {
    type: Schema.Types.ObjectId,
    ref: 'comic',
    required: [true, 'Data comicId dibutuhkan'],
  },
  title: {
    type: String,
    required: false,
  },
  index: {
    type: Number,
    required: [true, 'Data index dibutuhkan'],
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model("chapter", ChapterSchema);