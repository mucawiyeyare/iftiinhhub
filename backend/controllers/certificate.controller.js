import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

/**
 * Seed initial certificates if none exist in the database
 */
const seedSampleCertificatesIfEmpty = async () => {
  try {
    const count = await Certificate.countDocuments();
    if (count === 0) {
      const samples = [
        {
          certificateId: 'NTW-YEAR-A1B2C3D4',
          studentName: 'Abdirahman Mohamed Ali',
          studentEmail: 'abdirahman@example.com',
          courseTitle: 'Associate Full-Stack Web Developer (MERN Stack)',
          issueDate: new Date('2024-12-15'),
          completionDate: new Date('2024-12-10'),
          grade: 'Distinction (98%)',
          instructor: 'Eng. Mucawiye & IftiinHub Academic Team',
          skills: ['HTML5 & CSS3', 'Tailwind CSS', 'JavaScript ES6+', 'React.js', 'Node.js & Express', 'MongoDB'],
          status: 'valid'
        },
        {
          certificateId: 'NTW-2024-A1B2C3D4',
          studentName: 'Abdirahman Mohamed Ali',
          studentEmail: 'abdirahman@example.com',
          courseTitle: 'Associate Full-Stack Web Developer (MERN Stack)',
          issueDate: new Date('2024-12-15'),
          completionDate: new Date('2024-12-10'),
          grade: 'Distinction (98%)',
          instructor: 'Eng. Mucawiye & IftiinHub Academic Team',
          skills: ['HTML5 & CSS3', 'Tailwind CSS', 'JavaScript ES6+', 'React.js', 'Node.js & Express', 'MongoDB'],
          status: 'valid'
        },
        {
          certificateId: 'IFT-2025-WEB01',
          studentName: 'Fatima Hassan Warsame',
          studentEmail: 'fatima.warsame@example.com',
          courseTitle: 'Associate Full-Stack Web Developer',
          issueDate: new Date('2025-01-20'),
          completionDate: new Date('2025-01-18'),
          grade: 'Excellent (95%)',
          instructor: 'Eng. Mucawiye & IftiinHub Academic Team',
          skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Cloud Deployment'],
          status: 'valid'
        },
        {
          certificateId: 'IFT-2025-DATA02',
          studentName: 'Ahmed Jama Nur',
          studentEmail: 'ahmed.jama@example.com',
          courseTitle: 'Associate Data Analyst (Excel & Power BI)',
          issueDate: new Date('2025-02-10'),
          completionDate: new Date('2025-02-05'),
          grade: 'High Distinction (99%)',
          instructor: 'Data Analytics Lead - IftiinHub',
          skills: ['Advanced Excel', 'Microsoft Power BI', 'Power Query', 'DAX Formulas', 'Data Visualization'],
          status: 'valid'
        }
      ];
      await Certificate.insertMany(samples);
      console.log('Sample certificates seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding sample certificates:', error.message);
  }
};

/**
 * Verify Certificate by Certificate ID (Public - Case Insensitive)
 * GET /api/certificates/verify/:id
 */
export const verifyCertificate = async (req, res) => {
  try {
    const rawId = req.params.id || req.query.id;
    if (!rawId || !rawId.trim()) {
      return res.status(400).json({ message: 'Certificate ID is required' });
    }

    const cleanedId = rawId.trim();

    // Check if seeding is needed on first search
    await seedSampleCertificatesIfEmpty();

    // Case-insensitive exact match
    const certificate = await Certificate.findOne({
      certificateId: { $regex: new RegExp(`^${cleanedId.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i') }
    }).populate('courseId', 'name description duration')
      .populate('userId', 'name email');

    if (!certificate) {
      return res.status(404).json({
        found: false,
        message: 'No verified certificate found with this Certificate ID. Please verify the code and try again.'
      });
    }

    return res.status(200).json({
      found: true,
      certificate
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return res.status(500).json({ message: 'Server error while verifying certificate', error: error.message });
  }
};

/**
 * Get All Certificates (Admin)
 * GET /api/certificates
 */
export const getAllCertificates = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { certificateId: searchRegex },
          { studentName: searchRegex },
          { studentEmail: searchRegex },
          { courseTitle: searchRegex }
        ]
      };
    }

    const certificates = await Certificate.find(query)
      .populate('courseId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

/**
 * Issue / Create New Certificate (Admin)
 * POST /api/certificates
 */
export const createCertificate = async (req, res) => {
  try {
    const {
      certificateId,
      studentName,
      studentEmail,
      courseTitle,
      courseId,
      userId,
      issueDate,
      completionDate,
      grade,
      instructor,
      skills,
      status
    } = req.body;

    if (!studentName || !courseTitle) {
      return res.status(400).json({ message: 'Student Name and Course Title are required' });
    }

    // Generate unique ID if not provided
    let finalCertId = certificateId ? certificateId.trim().toUpperCase() : null;
    if (!finalCertId) {
      const year = new Date().getFullYear();
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      finalCertId = `IFT-${year}-${randomSuffix}`;
    }

    // Check for duplicate ID
    const existing = await Certificate.findOne({ certificateId: finalCertId });
    if (existing) {
      return res.status(400).json({ message: `Certificate ID ${finalCertId} already exists.` });
    }

    const newCertificate = new Certificate({
      certificateId: finalCertId,
      studentName,
      studentEmail,
      courseTitle,
      courseId: courseId || undefined,
      userId: userId || undefined,
      issueDate: issueDate || new Date(),
      completionDate: completionDate || new Date(),
      grade: grade || 'Passed',
      instructor: instructor || 'Eng. Mucawiye & IftiinHub Academic Team',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      status: status || 'valid'
    });

    await newCertificate.save();
    res.status(201).json({ message: 'Certificate issued successfully', certificate: newCertificate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to issue certificate', error: error.message });
  }
};

/**
 * Update Certificate (Admin)
 * PUT /api/certificates/:id
 */
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.certificateId) {
      updateData.certificateId = updateData.certificateId.trim().toUpperCase();
    }

    if (updateData.skills && typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map(s => s.trim());
    }

    const updated = await Certificate.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({ message: 'Certificate updated successfully', certificate: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update certificate', error: error.message });
  }
};

/**
 * Delete Certificate (Admin)
 * DELETE /api/certificates/:id
 */
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Certificate.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete certificate', error: error.message });
  }
};
