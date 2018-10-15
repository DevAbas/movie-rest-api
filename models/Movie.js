const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  director_id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, '`{PATH}` is required!'],
    maxlength: [15, '`{PATH}` must be smaller than `{MAXLENGTH}`!'],
    minlength: [3, '`{PATH}` must be bigger than `{MINLENGTH}`!'], 
  },
  category: {
    type: String,
    maxlength: 30,
    minlength: 1
  },
  country: {
    type: String,
    maxlength: 30,
    minlength: 1
  },
  year: {
    type: Number,
    max: 2040,
    min: 1900
  },
  imdb_score: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('movie', MovieSchema);