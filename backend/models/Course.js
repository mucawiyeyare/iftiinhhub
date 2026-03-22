import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  requirements: { type: String },
  whatYouWillLearn: [{ type: String }],
  // Course sections created by admin
  sections: [{
    id: { type: String, required: true },
    title: { type: String, required: true }
  }],
  videos: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: String },
    order: { type: Number, default: 0 },
    // Optional section id this video belongs to
    section: { type: String }
  }],
  // Keep backward compatibility
  video1: { type: String }, // YouTube video link 1
  video2: { type: String }, // YouTube video link 2
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);