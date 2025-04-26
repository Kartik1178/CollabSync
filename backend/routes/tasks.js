
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
  router.get("/:projectId/tasks/in-progress", async (req, res) => {
    try {
      const tasks = await Task.find({
        status: "in-progress",
        projectId: req.params.projectId
      }).populate("assigneeId", "name email"); // Optional: populate assignee details
  
      if (!tasks.length) {
        return res.status(404).json({
          success: false,
          message: "No in-progress tasks found for this project"
        });
      }
  
      res.status(200).json({ success: true, tasks });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  







  export default router;