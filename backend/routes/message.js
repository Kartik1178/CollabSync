
import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();


router.get('/:projectId', async (req, res) => {
  const messages = await Message.find({ project: req.params.projectId })
    .populate('sender', 'name image')
    .sort({ createdAt: 1 });
  res.json(messages);
});

// Post a new message
router.post('/', async (req, res) => {
  const { project, sender, text } = req.body;
  const message = await Message.create({ project, sender, text });
  const populated = await message.populate('sender', 'name image');
  res.status(201).json(populated);
});

export default router;
