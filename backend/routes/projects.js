import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
import { getAllProjects } from '../controllers/getAllProjects.js';
const router=express.Router();
router.post('/create',auth,async(req,res)=>{
    try{
const {title,
    description,
    technologies}=req.body;
    if(!title || !description){
        return res.status(400).json('Enter your project details');
    }
if(!technologies){
    return res.status(400).json('Atleast select one technology');
}
const project=new Project({
    title,
    description,
    technologies,
    owner:req.user._id
})
const savedProject= await project.save();
res.status(201).json(savedProject);
    }
    catch(err){
        console.error('Error creating project:', err);
res.status(500).json({error:'Server Error'})

    }
})
router.get('/find',auth,async(req,res)=>{
    try{
const user=req.user._id;
const projects=await Project.find({owner:user}).populate('tasks');
res.json({success:true,projects});
    }
    catch(err){
        console.error('Failed to fetch projects',err);
        res.status(500).json({success:false,error:"server error"});
    }

});
router.get('/fetchAll', getAllProjects);
router.post('/:id/request', auth, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      const userId = req.user._id;

      const alreadyMember = project.members.find(m => m.user.equals(userId));
      const alreadyRequested = project.joinRequests.find(r => r.user.equals(userId) && r.status === 'pending');
      
      if (alreadyMember || alreadyRequested) {
        return res.status(400).json({ message: 'Already a member or request pending' });
      }
  
      project.joinRequests.push({ user: userId });
      await project.save();
      res.json({ message: 'Request sent successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error sending request', error: err.message });
    }
  });
  
  router.get('/user/requests', auth, async (req, res) => {
    try {
      // Find all projects owned by the current user that have at least one pending request
      const projects = await Project.find({ owner: req.user._id })
        .populate('joinRequests.user')  // Populate the user who made the request
        .where('joinRequests.status').equals('pending');  // Only consider pending requests
    
      // Filter projects to include only those with pending requests
      const projectsWithRequests = projects.filter(project => project.joinRequests.length > 0);
      
      // Extract the pending requests with the user details
      const allRequests = projectsWithRequests.map(project => {
        return project.joinRequests.map(request => ({
          requestId: request._id,
          status: request.status,
          requestedAt: request.requestedAt,
          user: request.user, // This will include the user details who made the request
          project: {
            _id: project._id, // Add the project ID
            title: project.title, // Add the project title
          }
        }));
      }).flat(); // Flatten the array of requests
  
      if (allRequests.length === 0) {
        return res.status(404).json({ message: 'No requests found for the current user.' });
      }
  
      // Send the list of requests with project and user details
      res.json(allRequests);
    } catch (error) {
      console.error("Error fetching project requests:", error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  

  router.post('/:projectId/requests/:userId/accept', auth, async (req, res) => {
    const { projectId, userId } = req.params;
    const project = await Project.findById(projectId);
  
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the owner can accept requests' });
    }
  
    const request = project.joinRequests.find(r => r.user.equals(userId));
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ message: 'No pending request from this user' });
    }
  
    request.status = 'accepted';
    project.members.push({ user: userId });
    await project.save();
  
    res.json({ message: 'User added to project' });
  });
  
  router.post('/:projectId/requests/:userId/reject', auth, async (req, res) => {
    const { projectId, userId } = req.params;
  
    try {
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      if (!project.owner.equals(req.user._id)) {
        return res.status(403).json({ message: 'Only the project owner can reject requests' });
      }
  
      const request = project.joinRequests.find(
        (r) => r.user.equals(userId) && r.status === 'pending'
      );
  
      if (!request) {
        return res.status(400).json({ message: 'No pending request from this user' });
      }
  
      request.status = 'rejected';
      await project.save();
  
      res.json({ message: 'Join request rejected successfully' });
    } catch (error) {
      console.error("Error rejecting request:", error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  









export default router;