import Project from '../models/Project.js';

// Helper to format technologies array/string
const parseTechs = (techs) => {
  if (!techs) return [];
  if (Array.isArray(techs)) return techs.map(t => t.trim()).filter(Boolean);
  if (typeof techs === 'string') return techs.split(',').map(t => t.trim()).filter(Boolean);
  return [];
};

// @desc    Get all projects (public)
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

// @desc    Create a new project (Admin)
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, link, githubLink, logo, image, description, technologies } = req.body;

    if (!name || (!logo && !image)) {
      return res.status(400).json({
        success: false,
        message: 'Project name and logo/image URL are required'
      });
    }

    const mainImage = image || logo;
    const mainLogo = logo || image;

    const project = await Project.create({
      name,
      link: link || '',
      githubLink: githubLink || '',
      logo: mainLogo,
      image: mainImage,
      description: description || '',
      technologies: parseTechs(technologies)
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// @desc    Update a project (Admin)
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { name, link, githubLink, logo, image, description, technologies } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const mainImage = image || logo || project.image;
    const mainLogo = logo || image || project.logo;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name || project.name,
        link: link !== undefined ? link : project.link,
        githubLink: githubLink !== undefined ? githubLink : project.githubLink,
        logo: mainLogo,
        image: mainImage,
        description: description !== undefined ? description : project.description,
        technologies: technologies !== undefined ? parseTechs(technologies) : project.technologies
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// @desc    Delete a project (Admin)
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};
