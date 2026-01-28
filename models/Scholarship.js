const mongoose = require('mongoose');
const slugify = require('slugify');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  documents: { type: [String], required: true },
  deadline: { type: Date, required: true },
  steps: {
  stepsPerPage: Number,
  steps: Array
},
 // تغيير من Object إلى Array
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// pre-save hook بدون next
scholarshipSchema.pre('save', async function() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
