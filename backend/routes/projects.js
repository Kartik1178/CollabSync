import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
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
const projects=await Project.find({owner:user})
res.json({success:true,projects});
    }
    catch(err){
        console.error('Failed to fetch projects',err);
        res.status(500).json({success:false,error:"server error"});
    }

});
export default router;