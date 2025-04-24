
import express from 'express';
import Task from '../models/Task.js';
const router=express.Router();
router.post("/create", async (req, res) => {
    try {
      const { title, description, status, projectId } = req.body;
      const task = await Task.create({ title, description, status, projectId });
      res.status(201).json({ success: true, task });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  export default router;