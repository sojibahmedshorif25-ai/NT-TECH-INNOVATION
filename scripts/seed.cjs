/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Gracefully fallback
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://sojibahmedshorif25_db_user:sFNxVUNWptvibS1e@cluster0.bmhttkc.mongodb.net/smarthire?retryWrites=true&w=majority';

// Minimal schema definitions for seeding
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
    title: String,
    bio: String,
    skills: [String],
  },
  { timestamps: true }
);

const JobSchema = new mongoose.Schema(
  {
    title: String,
    department: String,
    location: String,
    type: String,
    experienceLevel: String,
    salaryMin: Number,
    salaryMax: Number,
    currency: String,
    description: String,
    requirements: [String],
    skills: [String],
    status: String,
    recruiterId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: mongoose.Schema.Types.ObjectId,
    candidateId: mongoose.Schema.Types.ObjectId,
    candidateName: String,
    candidateEmail: String,
    candidatePhone: String,
    portfolioUrl: String,
    yearsOfExperience: Number,
    expectedSalary: Number,
    resumeText: String,
    pipelineStage: String,
    stageHistory: Array,
    aiMatchReport: Object,
    recruiterNotes: String,
  },
  { timestamps: true }
);

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected successfully!');

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
  const Application =
    mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

  // Clear existing demo records
  await User.deleteMany({ email: { $in: ['admin@smarthire.com', 'candidate@smarthire.com'] } });
  console.log('Cleared previous demo users.');

  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  const recruiter = await User.create({
    name: 'Sarah Jenkins',
    email: 'admin@smarthire.com',
    passwordHash: adminHash,
    role: 'RECRUITER',
    title: 'Head of Technical Recruiting',
    bio: 'Lead talent strategist specialized in cloud engineering and full stack recruitment.',
    skills: ['Talent Sourcing', 'System Architecture Review', 'Technical Interviewing'],
  });

  const candidate = await User.create({
    name: 'Alex Rivera',
    email: 'candidate@smarthire.com',
    passwordHash: userHash,
    role: 'CANDIDATE',
    title: 'Senior Full Stack Engineer',
    bio: 'Passionate developer with 6 years building high-throughput web applications with Next.js, Node.js, and AI workflows.',
    skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'MongoDB', 'Docker', 'GraphQL'],
  });

  console.log('Created demo users:');
  console.log('Recruiter: admin@smarthire.com / admin123');
  console.log('Candidate: candidate@smarthire.com / user123');

  // Check or create demo jobs
  let job1 = await Job.findOne({ title: 'Senior Full Stack Engineer (Next.js & TypeScript)' });
  if (!job1) {
    job1 = await Job.create({
      title: 'Senior Full Stack Engineer (Next.js & TypeScript)',
      department: 'Core Platform Engineering',
      location: 'Remote (Worldwide)',
      type: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      salaryMin: 120000,
      salaryMax: 155000,
      currency: 'USD',
      description:
        'We are seeking an exceptional Senior Full Stack Engineer to drive our core web application architecture. You will architect high-performance React frontends, scalable Node.js microservices, and integrate modern generative AI features into user-facing workflows.',
      requirements: [
        '5+ years production experience with React, TypeScript, and modern Node.js',
        'Proven expertise building scalable REST APIs and handling database persistence with MongoDB or PostgreSQL',
        'Demonstrated understanding of authentication, RBAC, and cloud deployment pipelines',
        'Experience integrating AI/LLM APIs (e.g. Gemini, OpenAI) into interactive applications',
      ],
      skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Gemini AI'],
      status: 'OPEN',
      recruiterId: recruiter._id,
    });

    await Job.create({
      title: 'Lead AI & Backend Systems Developer',
      department: 'Machine Intelligence',
      location: 'Hybrid (San Francisco / Remote)',
      type: 'FULL_TIME',
      experienceLevel: 'LEAD',
      salaryMin: 145000,
      salaryMax: 185000,
      currency: 'USD',
      description:
        'Join as our Lead Backend Systems Architect. You will lead the engineering of intelligent agent pipelines, vector database search, and high-throughput microservices.',
      requirements: [
        '6+ years backend software engineering experience',
        'Deep understanding of distributed systems, concurrency, and API security',
        'Hands-on experience with LLM orchestration and automated evaluation frameworks',
      ],
      skills: ['Node.js', 'Python', 'Microservices', 'MongoDB', 'PostgreSQL', 'Docker', 'AI Workflows'],
      status: 'OPEN',
      recruiterId: recruiter._id,
    });

    console.log('Created sample job postings.');
  }

  // Create demo application
  await Application.deleteMany({ candidateId: candidate._id });

  await Application.create({
    jobId: job1._id,
    candidateId: candidate._id,
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    candidatePhone: '+1 (555) 349-8821',
    portfolioUrl: 'https://alexrivera.dev',
    yearsOfExperience: 6,
    expectedSalary: 135000,
    resumeText: `Alex Rivera - Senior Full Stack Engineer
Summary: 6 years of experience architecting resilient web platforms using TypeScript, Next.js, and Node.js. 
Tech Stack: React, Next.js App Router, Node.js, Express, MongoDB, PostgreSQL, Docker, Git, REST APIs, Gemini AI.
Experience:
- Senior Engineer at CloudScale (2022-Present): Led frontend & API overhaul, reducing page load by 45%. Built AI-assisted search using vector embeddings and Gemini API.
- Full Stack Developer at DevStream (2020-2022): Developed microservices handling 2M requests/day, designed relational schemas and automated testing suites.
Education: B.S. in Computer Science.`,
    pipelineStage: 'AI_SCREENED',
    stageHistory: [
      {
        fromStage: 'INITIAL',
        toStage: 'APPLIED',
        changedBy: candidate._id,
        note: 'Candidate submitted online application.',
        changedAt: new Date(Date.now() - 3600000 * 4),
      },
      {
        fromStage: 'APPLIED',
        toStage: 'AI_SCREENED',
        changedBy: recruiter._id,
        note: 'AI Screened candidate with 92% fit index.',
        changedAt: new Date(Date.now() - 3600000 * 3),
      },
    ],
    aiMatchReport: {
      score: 92,
      summary:
        'Alex Rivera is an outstanding match for Senior Full Stack Engineer with 6 years of proven production experience in Next.js, TypeScript, and AI integrations.',
      matchedSkills: [
        'TypeScript',
        'Next.js',
        'React',
        'Node.js',
        'MongoDB',
        'REST APIs',
        'Gemini AI',
      ],
      missingSkills: [],
      strengths: [
        'Direct hands-on experience with the exact required tech stack (Next.js, TypeScript, Node.js)',
        'Demonstrated background integrating LLM/AI workflows in production',
        'Solid 6 years of seniority exceeding the 5-year requirement',
      ],
      weaknesses: [
        'Verify depth of system architecture & microservices scaling during technical interview',
      ],
      recommendation: 'HIGHLY_RECOMMENDED',
      evaluatedAt: new Date(),
    },
    recruiterNotes: 'Candidate has stellar background in Next.js & AI. Ready to shortlist for round 1.',
  });

  console.log('Created sample application with full AI evaluation report.');
  console.log('Seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
