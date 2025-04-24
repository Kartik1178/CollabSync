import mongoose from 'mongoose';
import Project from './models/Project.js';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User IDs (These are the specific user IDs you provided)
const users = [
  {
    userId: '680a0b04cbae79a225cfa191',  // Aanya Verma
    name: 'Aanya Verma'
  },
  {
    userId: '680a0b04cbae79a225cfa193',  // Brayden Cruz
    name: 'Brayden Cruz'
  },
  {
    userId: '680a0b04cbae79a225cfa195',  // Chiara Russo
    name: 'Chiara Russo'
  },
  {
    userId: '680a0b04cbae79a225cfa197',  // Devon Blake
    name: 'Devon Blake'
  },
  {
    userId: '680a0b04cbae79a225cfa199',  // Elina Chen
    name: 'Elina Chen'
  },
  {
    userId: '680a0b04cbae79a225cfa19b',  // Farhan Iqbal
    name: 'Farhan Iqbal'
  },
  {
    userId: '680a0b05cbae79a225cfa19d',  // Gianna Smith
    name: 'Gianna Smith'
  },
  {
    userId: '680a0b05cbae79a225cfa19f',  // Hiro Tanaka
    name: 'Hiro Tanaka'
  },
  {
    userId: '680a0b05cbae79a225cfa1a1',  // Ines Dupont
    name: 'Ines Dupont'
  },
  {
    userId: '680a0b05cbae79a225cfa1a3',  // Jasper Lee
    name: 'Jasper Lee'
  }
];

// Define the projects with user association
const projects = [
  {
    title: 'Smart AI Tutor',
    description: 'An intelligent virtual assistant that adapts to student learning styles.',
    tech: ['Python', 'TensorFlow'],
    owner: users[0].userId  // Assigning Aanya Verma
  },
  {
    title: 'ML Stock Predictor',
    description: 'Predicts stock prices using machine learning regression models.',
    tech: ['Python', 'scikit-learn'],
    owner: users[1].userId  // Assigning Brayden Cruz
  },
  {
    title: 'Neural Art Generator',
    description: 'Creates unique digital art using deep neural networks.',
    tech: ['Keras', 'PyTorch'],
    owner: users[2].userId  // Assigning Chiara Russo
  },
  {
    title: 'Resume Parser Bot',
    description: 'Extracts and analyzes resumes using NLP techniques.',
    tech: ['NLTK', 'spaCy'],
    owner: users[3].userId  // Assigning Devon Blake
  },
  {
    title: 'Smart Surveillance System',
    description: 'Real-time object detection for security using computer vision.',
    tech: ['OpenCV', 'Python'],
    owner: users[4].userId  // Assigning Elina Chen
  },
  {
    title: 'ThreatAnalyzer',
    description: 'A network threat detection system for cybersecurity analysts.',
    tech: ['Wireshark', 'Python'],
    owner: users[5].userId  // Assigning Farhan Iqbal
  },
  {
    title: 'Insightful Dash',
    description: 'An analytics dashboard for big data insights.',
    tech: ['Pandas', 'NumPy'],
    owner: users[6].userId  // Assigning Gianna Smith
  },
  {
    title: 'CloudDeploy Pro',
    description: 'One-click deployment of microservices using cloud infrastructure.',
    tech: ['AWS', 'Docker'],
    owner: users[7].userId  // Assigning Hiro Tanaka
  },
  {
    title: 'DevLink Platform',
    description: 'A platform to connect developers via full-stack web apps.',
    tech: ['React', 'Node.js'],
    owner: users[8].userId  // Assigning Ines Dupont
  },
  {
    title: 'FitMate',
    description: 'A cross-platform fitness tracker for mobile devices.',
    tech: ['Flutter', 'Dart'],
    owner: users[9].userId  // Assigning Jasper Lee
  },
  // Add more projects as needed...
];

const seedProjects = async () => {
  try {
    await Project.deleteMany(); // Optional: clear existing projects

    const projectDocs = projects.map(p => ({
      title: p.title,
      description: p.description,
      technologies: p.tech,
      owner: p.owner
    }));

    await Project.insertMany(projectDocs);
    console.log('✅ Projects seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedProjects();
