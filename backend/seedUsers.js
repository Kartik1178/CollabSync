import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../backend/models/User.js'; 

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

const techList = [
  'Python', 'JavaScript', 'Java', 'C++', 'Go',
  'Rust', 'TypeScript', 'Ruby', 'Kotlin', 'Swift',
  'React', 'Vue', 'Angular', 'Node.js', 'Django',
  'Flask', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL'
];

// User seed data
const usersToSeed = [
  { name: 'Aanya Verma', email: 'aanya.verma@gmail.com', age: 24, password: 'aanya123' },
  { name: 'Brayden Cruz', email: 'brayden.cruz@yahoo.com', age: 29, password: 'brayden123' },
  { name: 'Chiara Russo', email: 'chiara.russo@outlook.com', age: 26, password: 'chiara123' },
  { name: 'Devon Blake', email: 'devon.blake@hotmail.com', age: 31, password: 'devon123' },
  { name: 'Elina Chen', email: 'elina.chen@protonmail.com', age: 22, password: 'elina123' },
  { name: 'Farhan Iqbal', email: 'farhan.iqbal@gmail.com', age: 28, password: 'farhan123' },
  { name: 'Gianna Smith', email: 'gianna.smith@yahoo.com', age: 27, password: 'gianna123' },
  { name: 'Hiro Tanaka', email: 'hiro.tanaka@outlook.com', age: 30, password: 'hiro123' },
  { name: 'Ines Dupont', email: 'ines.dupont@orange.fr', age: 25, password: 'ines123' },
  { name: 'Jasper Lee', email: 'jasper.lee@icloud.com', age: 23, password: 'jasper123' }
];

const getRandomTechnologies = () => {
  const shuffled = techList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 5 + 3)); // 3–7 technologies
};

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    

    const users = [];

    for (const user of usersToSeed) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const techs = getRandomTechnologies();

      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        age: user.age,
        technologies: techs
      });

      await newUser.save();
      users.push({ ...user, technologies: techs });
    }

    console.table(users.map(u => ({
      Name: u.name,
      Email: u.email,
      Password: u.password,
      Technologies: u.technologies.join(', ')
    })));

    console.log('✅ Users seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
