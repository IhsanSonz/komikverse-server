import { Schema, model } from "mongoose";
const schema = Schema;

const ComicSchema = new schema({
  title: {
    type: String,
    required: [true, 'Data title dibutuhkan'],
  },
  author: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  thumb_url: {
    type: String,
    required: false,
  },
  episodes: [{
    type: Schema.Types.ObjectId,
    ref: 'episode',
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model("comic", ComicSchema);