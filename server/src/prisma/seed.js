import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const companies = [
  { name: 'TechCorp Solutions', industry: 'Technology', website: 'https://techcorp.io', description: 'Leading software development company specializing in enterprise solutions.', city: 'San Francisco', state: 'CA' },
  { name: 'FinanceHub Inc', industry: 'Finance', website: 'https://financehub.com', description: 'Modern fintech company revolutionizing personal banking.', city: 'New York', state: 'NY' },
  { name: 'HealthFirst Medical', industry: 'Healthcare', website: 'https://healthfirst.org', description: 'Healthcare provider focused on patient-centered care.', city: 'Boston', state: 'MA' },
  { name: 'RetailMax', industry: 'Retail', website: 'https://retailmax.com', description: 'Omnichannel retail leader with stores across North America.', city: 'Chicago', state: 'IL' },
  { name: 'EduLearn Academy', industry: 'Education', website: 'https://edulearn.edu', description: 'Online learning platform empowering students worldwide.', city: 'Austin', state: 'TX' },
  { name: 'GreenEnergy Co', industry: 'Energy', website: 'https://greenenergy.co', description: 'Sustainable energy solutions for a cleaner future.', city: 'Denver', state: 'CO' },
  { name: 'MediaWorks Studio', industry: 'Media', website: 'https://mediaworks.studio', description: 'Creative agency producing digital content and campaigns.', city: 'Los Angeles', state: 'CA' },
  { name: 'LogiTech Systems', industry: 'Technology', website: 'https://logitechsys.com', description: 'Supply chain and logistics software specialists.', city: 'Seattle', state: 'WA' }
];

const jobs = [
  { title: 'Senior Full Stack Developer', description: 'We are looking for an experienced full stack developer to join our engineering team. You will work on building scalable web applications using modern technologies.', requirements: ['5+ years experience', 'React/Node.js expertise', 'Database design'], responsibilities: ['Build and maintain web applications', 'Collaborate with cross-functional teams', 'Mentor junior developers'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 120000, salaryMax: 180000, experienceRequired: 5, skillsRequired: ['react', 'nodejs', 'postgresql', 'typescript'], status: 'ACTIVE' },
  { title: 'Financial Analyst', description: 'Join our finance team to analyze market trends and provide strategic insights.', requirements: ['MBA or equivalent', '3+ years in finance', 'Excel proficiency'], responsibilities: ['Analyze financial data', 'Prepare reports', 'Support budgeting'], jobType: 'FULL_TIME', location: 'New York, NY', salaryMin: 85000, salaryMax: 120000, experienceRequired: 3, skillsRequired: ['excel', 'financial-analysis', 'sql'], status: 'ACTIVE' },
  { title: 'Registered Nurse', description: 'Provide exceptional patient care in our modern facility.', requirements: ['RN license', 'BLS certification', '2+ years experience'], responsibilities: ['Patient assessment', 'Medication administration', 'Documentation'], jobType: 'FULL_TIME', location: 'Boston, MA', salaryMin: 75000, salaryMax: 95000, experienceRequired: 2, skillsRequired: ['patient-care', 'medical-software', 'communication'], status: 'ACTIVE' },
  { title: 'Marketing Manager', description: 'Lead our marketing initiatives across digital and traditional channels.', requirements: ['Marketing degree', '5+ years experience', 'Campaign management'], responsibilities: ['Develop marketing strategies', 'Manage campaigns', 'Analyze metrics'], jobType: 'FULL_TIME', location: 'Chicago, IL', salaryMin: 90000, salaryMax: 130000, experienceRequired: 5, skillsRequired: ['digital-marketing', 'seo', 'analytics', 'leadership'], status: 'ACTIVE' },
  { title: 'Online Instructor - Data Science', description: 'Teach data science courses to thousands of students worldwide.', requirements: ['Masters in related field', 'Teaching experience', 'Python proficiency'], responsibilities: ['Create course content', 'Conduct live sessions', 'Mentor students'], jobType: 'CONTRACT', location: 'Remote', salaryMin: 60000, salaryMax: 90000, experienceRequired: 3, skillsRequired: ['python', 'machine-learning', 'teaching'], status: 'ACTIVE' },
  { title: 'Sales Representative', description: 'Drive revenue growth through new customer acquisition.', requirements: ['Sales experience', 'CRM knowledge', 'Strong communication'], responsibilities: ['Prospect new clients', 'Maintain client relationships', 'Achieve targets'], jobType: 'FULL_TIME', location: 'Denver, CO', salaryMin: 50000, salaryMax: 80000, experienceRequired: 2, skillsRequired: ['sales', 'crm', 'negotiation'], status: 'ACTIVE' },
  { title: 'Content Creator', description: 'Create engaging video and written content for our brand.', requirements: ['Portfolio required', 'Video editing skills', 'Social media knowledge'], responsibilities: ['Create video content', 'Write blog posts', 'Manage social accounts'], jobType: 'PART_TIME', location: 'Los Angeles, CA', salaryMin: 45000, salaryMax: 65000, experienceRequired: 2, skillsRequired: ['video-editing', 'content-creation', 'social-media'], status: 'ACTIVE' },
  { title: 'DevOps Engineer', description: 'Build and maintain our cloud infrastructure and deployment pipelines.', requirements: ['AWS/Azure experience', 'CI/CD expertise', 'Infrastructure as code'], responsibilities: ['Manage cloud infrastructure', 'Implement CI/CD', 'Monitor systems'], jobType: 'FULL_TIME', location: 'Seattle, WA', salaryMin: 110000, salaryMax: 160000, experienceRequired: 4, skillsRequired: ['aws', 'docker', 'kubernetes', 'terraform'], status: 'ACTIVE' },
  { title: 'UX Designer', description: 'Design intuitive user experiences for our SaaS products.', requirements: ['Design portfolio', 'Figma proficiency', 'User research'], responsibilities: ['Conduct user research', 'Create wireframes', 'Design prototypes'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 95000, salaryMax: 140000, experienceRequired: 3, skillsRequired: ['figma', 'user-research', 'prototyping'], status: 'ACTIVE' },
  { title: 'HR Coordinator', description: 'Support HR operations and employee experience initiatives.', requirements: ['HR degree preferred', '2+ years experience', 'HRIS experience'], responsibilities: ['Onboarding coordination', 'Benefits administration', 'HRIS management'], jobType: 'FULL_TIME', location: 'Chicago, IL', salaryMin: 50000, salaryMax: 65000, experienceRequired: 2, skillsRequired: ['hris', 'recruiting', 'employee-relations'], status: 'ACTIVE' },
  { title: 'Junior Web Developer', description: 'Great opportunity for a recent graduate to learn and grow.', requirements: ['HTML/CSS/JS', 'Git basics', 'Eagerness to learn'], responsibilities: ['Implement UI components', 'Fix bugs', 'Write tests'], jobType: 'INTERNSHIP', location: 'Remote', salaryMin: 35000, salaryMax: 45000, experienceRequired: 0, skillsRequired: ['html', 'css', 'javascript'], status: 'ACTIVE' },
  { title: 'Data Engineer', description: 'Build and maintain data pipelines and warehousing solutions.', requirements: ['SQL expertise', 'Python skills', 'ETL experience'], responsibilities: ['Build data pipelines', 'Design data models', 'Optimize queries'], jobType: 'FULL_TIME', location: 'New York, NY', salaryMin: 115000, salaryMax: 155000, experienceRequired: 4, skillsRequired: ['python', 'sql', 'spark', 'airflow'], status: 'ACTIVE' },
  { title: 'Customer Success Manager', description: 'Help our enterprise clients achieve success with our products.', requirements: ['SaaS experience', 'Technical aptitude', 'Communication skills'], responsibilities: ['Onboard new clients', 'Conduct check-ins', 'Gather feedback'], jobType: 'FULL_TIME', location: 'Austin, TX', salaryMin: 70000, salaryMax: 100000, experienceRequired: 3, skillsRequired: ['saas', 'customer-success', 'presentation'], status: 'ACTIVE' },
  { title: 'Quality Assurance Engineer', description: 'Ensure the quality of our software through comprehensive testing.', requirements: ['Testing experience', 'Automation skills', 'Detail-oriented'], responsibilities: ['Write test plans', 'Execute tests', 'Report bugs'], jobType: 'CONTRACT', location: 'Remote', salaryMin: 70000, salaryMax: 95000, experienceRequired: 3, skillsRequired: ['selenium', 'jest', 'jmeter'], status: 'ACTIVE' },
  { title: 'Product Manager', description: 'Lead product development from ideation to launch.', requirements: ['Product management experience', 'Technical background', 'Analytical mindset'], responsibilities: ['Define product roadmap', 'Gather requirements', 'Coordinate releases'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 130000, salaryMax: 180000, experienceRequired: 5, skillsRequired: ['product-management', 'agile', 'analytics'], status: 'ACTIVE' },
  { title: 'Graphic Designer', description: 'Create visual designs for marketing and product teams.', requirements: ['Design portfolio', 'Adobe Suite', 'Brand design'], responsibilities: ['Create marketing assets', 'Design web graphics', 'Develop brand identity'], jobType: 'PART_TIME', location: 'Los Angeles, CA', salaryMin: 50000, salaryMax: 70000, experienceRequired: 2, skillsRequired: ['photoshop', 'illustrator', 'indesign'], status: 'PAUSED' },
  { title: 'Network Administrator', description: 'Manage and maintain company network infrastructure.', requirements: ['Networking certifications', 'Server management', 'Security knowledge'], responsibilities: ['Maintain network', 'Manage servers', 'Implement security'], jobType: 'FULL_TIME', location: 'Denver, CO', salaryMin: 75000, salaryMax: 100000, experienceRequired: 3, skillsRequired: ['networking', 'windows-server', 'security'], status: 'DRAFT' },
  { title: 'Social Media Specialist', description: 'Grow our social media presence and engage with our community.', requirements: ['Social media experience', 'Content creation', 'Analytics knowledge'], responsibilities: ['Manage social accounts', 'Create content calendar', 'Track metrics'], jobType: 'FREELANCE', location: 'Remote', salaryMin: 40000, salaryMax: 55000, experienceRequired: 2, skillsRequired: ['social-media', 'content-creation', 'analytics'], status: 'ACTIVE' },
  { title: 'Technical Writer', description: 'Create clear and comprehensive documentation for our products.', requirements: ['Technical writing samples', 'API documentation', 'Editing skills'], responsibilities: ['Write documentation', 'Create tutorials', 'Maintain docs site'], jobType: 'CONTRACT', location: 'Remote', salaryMin: 55000, salaryMax: 75000, experienceRequired: 3, skillsRequired: ['technical-writing', 'markdown', 'api-docs'], status: 'ACTIVE' },
  { title: 'Business Analyst', description: 'Bridge the gap between business needs and technology solutions.', requirements: ['BA certification', 'Process modeling', 'Stakeholder management'], responsibilities: ['Gather requirements', 'Analyze processes', 'Document workflows'], jobType: 'FULL_TIME', location: 'Chicago, IL', salaryMin: 80000, salaryMax: 110000, experienceRequired: 3, skillsRequired: ['business-analysis', 'visio', 'sql'], status: 'ACTIVE' },
  { title: 'Frontend Developer - React', description: 'Build beautiful and performant user interfaces.', requirements: ['React expertise', 'CSS/SASS skills', 'Component design'], responsibilities: ['Build UI components', 'Implement designs', 'Optimize performance'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 100000, salaryMax: 145000, experienceRequired: 3, skillsRequired: ['react', 'typescript', 'css', 'redux'], status: 'ACTIVE' },
  { title: 'Backend Developer - Python', description: 'Build robust APIs and backend services.', requirements: ['Python expertise', 'API design', 'Database knowledge'], responsibilities: ['Build APIs', 'Write backend logic', 'Optimize database queries'], jobType: 'FULL_TIME', location: 'Seattle, WA', salaryMin: 105000, salaryMax: 150000, experienceRequired: 4, skillsRequired: ['python', 'fastapi', 'postgresql', 'redis'], status: 'ACTIVE' },
  { title: 'Mobile Developer - React Native', description: 'Develop cross-platform mobile applications.', requirements: ['React Native experience', 'iOS/Android knowledge', 'App store submissions'], responsibilities: ['Develop mobile app', 'Fix platform issues', 'Implement features'], jobType: 'FULL_TIME', location: 'Austin, TX', salaryMin: 95000, salaryMax: 135000, experienceRequired: 3, skillsRequired: ['react-native', 'javascript', 'mobile-development'], status: 'ACTIVE' },
  { title: 'Scrum Master', description: 'Facilitate agile processes and help teams deliver value.', requirements: ['Scrum Master certification', 'Agile experience', 'Coaching skills'], responsibilities: ['Run ceremonies', 'Remove impediments', 'Coach teams'], jobType: 'FULL_TIME', location: 'New York, NY', salaryMin: 85000, salaryMax: 120000, experienceRequired: 3, skillsRequired: ['scrum', 'agile', 'coaching'], status: 'CLOSED' },
  { title: 'Security Analyst', description: 'Protect company assets and ensure compliance.', requirements: ['Security certifications', 'Penetration testing', 'Incident response'], responsibilities: ['Monitor security', 'Respond to incidents', 'Conduct audits'], jobType: 'FULL_TIME', location: 'Boston, MA', salaryMin: 95000, salaryMax: 135000, experienceRequired: 4, skillsRequired: ['security', 'penetration-testing', 'siem'], status: 'ACTIVE' }
];

const candidates = [
  { fullName: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', city: 'San Francisco', state: 'CA', bio: 'Passionate software engineer with 6 years of experience building scalable web applications.', skills: ['react', 'nodejs', 'typescript', 'postgresql'], experienceYears: 6, education: 'BS Computer Science, Stanford University 2018' },
  { fullName: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', city: 'New York', state: 'NY', bio: 'Data-driven financial analyst with expertise in risk assessment and portfolio management.', skills: ['python', 'sql', 'excel', 'financial-analysis'], experienceYears: 4, education: 'MBA Finance, NYU 2020' },
  { fullName: 'Carol Williams', email: 'carol@example.com', phone: '555-0103', city: 'Boston', state: 'MA', bio: 'Dedicated healthcare professional committed to providing exceptional patient care.', skills: ['patient-care', 'medical-software', 'empathy'], experienceYears: 5, education: 'BS Nursing, Boston College 2019' },
  { fullName: 'David Brown', email: 'david@example.com', phone: '555-0104', city: 'Chicago', state: 'IL', bio: 'Creative marketer with a track record of successful campaigns and brand growth.', skills: ['digital-marketing', 'seo', 'content-creation', 'analytics'], experienceYears: 7, education: 'BA Marketing, Northwestern 2017' },
  { fullName: 'Eva Martinez', email: 'eva@example.com', phone: '555-0105', city: 'Austin', state: 'TX', bio: 'Eager recent graduate passionate about technology and eager to learn new skills.', skills: ['html', 'css', 'javascript', 'python'], experienceYears: 0, education: 'BS Computer Science, UT Austin 2024' },
  { fullName: 'Frank Lee', email: 'frank@example.com', phone: '555-0106', city: 'Seattle', state: 'WA', bio: 'DevOps engineer with expertise in cloud infrastructure and CI/CD pipelines.', skills: ['aws', 'docker', 'kubernetes', 'terraform'], experienceYears: 5, education: 'BS Information Systems, UW 2019' },
  { fullName: 'Grace Chen', email: 'grace@example.com', phone: '555-0107', city: 'San Francisco', state: 'CA', bio: 'UX designer focused on creating intuitive and delightful user experiences.', skills: ['figma', 'user-research', 'prototyping', 'wireframing'], experienceYears: 4, education: 'MA Interaction Design, CCA 2020' },
  { fullName: 'Henry Wilson', email: 'henry@example.com', phone: '555-0108', city: 'Denver', state: 'CO', bio: 'Sales professional with strong relationships in the tech industry.', skills: ['sales', 'crm', 'negotiation', 'prospecting'], experienceYears: 6, education: 'BA Business, CU Boulder 2018' },
  { fullName: 'Ivy Taylor', email: 'ivy@example.com', phone: '555-0109', city: 'Los Angeles', state: 'CA', bio: 'Creative content creator with a growing social media following.', skills: ['video-editing', 'content-creation', 'social-media', 'photography'], experienceYears: 3, education: 'BA Communications, UCLA 2021' },
  { fullName: 'Jack Anderson', email: 'jack@example.com', phone: '555-0110', city: 'Austin', state: 'TX', bio: 'Data engineer building pipelines that power business intelligence.', skills: ['python', 'sql', 'spark', 'airflow', 'aws'], experienceYears: 4, education: 'MS Data Science, UT Austin 2020' }
];

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@talentbridge.com' },
    update: {},
    create: {
      email: 'admin@talentbridge.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: true
    }
  });
  console.log('Admin created:', admin.email);

  const createdCompanies = [];
  for (const companyData of companies) {
    const company = await prisma.company.create({ data: companyData });
    createdCompanies.push(company);
  }
  console.log('Created', createdCompanies.length, 'companies');

  const createdJobs = [];
  for (let i = 0; i < jobs.length; i++) {
    const jobData = jobs[i];
    const company = createdCompanies[i % createdCompanies.length];
    const job = await prisma.job.create({
      data: { ...jobData, companyId: company.id, createdByAdminId: admin.id }
    });
    createdJobs.push(job);
  }
  console.log('Created', createdJobs.length, 'jobs');

  const createdCandidates = [];
  for (const candidateData of candidates) {
    const password = await bcrypt.hash('Candidate@123', 12);
    const user = await prisma.user.create({
      data: {
        email: candidateData.email,
        passwordHash: password,
        role: 'CANDIDATE',
        emailVerified: true,
        candidateProfile: {
          create: {
            fullName: candidateData.fullName,
            phone: candidateData.phone,
            city: candidateData.city,
            state: candidateData.state,
            bio: candidateData.bio,
            skills: candidateData.skills,
            experienceYears: candidateData.experienceYears,
            education: candidateData.education
          }
        }
      },
      include: { candidateProfile: true }
    });
    createdCandidates.push(user);
  }
  console.log('Created', createdCandidates.length, 'candidates');

  const statuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED'];
  let appCount = 0;
  for (let i = 0; i < 30; i++) {
    const job = createdJobs[i % createdJobs.length];
    const candidate = createdCandidates[i % createdCandidates.length];
    
    try {
      await prisma.application.create({
        data: {
          jobId: job.id,
          candidateId: candidate.candidateProfile.id,
          status: statuses[i % statuses.length],
          coverLetter: 'I am excited to apply for this position. My skills and experience align well with the requirements.'
        }
      });
      appCount++;
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log('Created', appCount, 'applications');

  console.log('Seed completed successfully!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
