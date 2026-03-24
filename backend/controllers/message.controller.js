import Message from '../models/Message.js';

// POST /api/messages - Submit a contact message (public)
export const createMessage = async (req, res) => {
  try {
    const { name, email, whatsapp, message, type, subject, courseDetails } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const newMessage = await Message.create({
      name,
      email,
      whatsapp: whatsapp || '',
      message,
      type: type || 'general',
      subject: subject || 'General Inquiry',
      courseDetails: courseDetails || null,
    });

    res.status(201).json({ message: 'Message sent successfully.', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/messages - Get all messages (admin only)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH /api/messages/:id/read - Mark a message as read (admin only)
export const markAsRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found.' });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/messages/:id - Delete a message (admin only)
export const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
