import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  githubLink: {
    type: String,
    trim: true,
    default: ''
  },
  logo: {
    type: String,
    required: [true, 'Project logo / image URL is required'],
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  technologies: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
