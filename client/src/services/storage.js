const STORAGE_KEY = 'talentbridge_data';

const defaultData = {
  users: [
    { id: 'admin1', email: 'admin@talentbridge.com', password: 'Admin@123', role: 'ADMIN', fullName: 'Admin User', profilePhotoUrl: null, skills: [], experienceYears: 0, bio: '', education: '', phone: '', city: '', state: '' }
  ],
  jobs: [
    { id: '1', companyId: '1', title: 'Senior Full Stack Developer', description: 'We are looking for an experienced full stack developer to join our engineering team. You will work on building scalable web applications using modern technologies.', requirements: ['5+ years experience', 'React/Node.js', 'Database design', 'Team collaboration'], responsibilities: ['Build web applications', 'Collaborate with teams', 'Mentor junior devs', 'Code reviews'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 120000, salaryMax: 180000, experienceRequired: 5, skillsRequired: ['react', 'nodejs', 'postgresql', 'typescript'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '2', companyId: '2', title: 'Financial Analyst', description: 'Join our finance team to analyze market trends and provide insights for investment decisions.', requirements: ['MBA or equivalent', '3+ years finance experience', 'Excel proficiency'], responsibilities: ['Analyze financial data', 'Prepare reports', 'Market research'], jobType: 'FULL_TIME', location: 'New York, NY', salaryMin: 85000, salaryMax: 120000, experienceRequired: 3, skillsRequired: ['excel', 'financial-analysis', 'sql'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '3', companyId: '3', title: 'Registered Nurse', description: 'Provide exceptional patient care in our state-of-the-art medical facility.', requirements: ['RN license', 'BLS certification', '2+ years experience'], responsibilities: ['Patient assessment', 'Medication administration', 'Record keeping'], jobType: 'FULL_TIME', location: 'Boston, MA', salaryMin: 75000, salaryMax: 95000, experienceRequired: 2, skillsRequired: ['patient-care', 'medical-software'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '4', companyId: '4', title: 'Marketing Manager', description: 'Lead our marketing initiatives and drive brand growth.', requirements: ['Marketing degree', '5+ years experience', 'Team leadership'], responsibilities: ['Develop strategies', 'Manage campaigns', 'Budget planning'], jobType: 'FULL_TIME', location: 'Chicago, IL', salaryMin: 90000, salaryMax: 130000, experienceRequired: 5, skillsRequired: ['digital-marketing', 'seo', 'analytics'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '5', companyId: '5', title: 'Online Instructor', description: 'Teach data science courses to thousands of students worldwide.', requirements: ['Masters degree', 'Python expertise', 'Teaching experience'], responsibilities: ['Create content', 'Conduct sessions', 'Grade assignments'], jobType: 'CONTRACT', location: 'Remote', salaryMin: 60000, salaryMax: 90000, experienceRequired: 3, skillsRequired: ['python', 'machine-learning'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '6', companyId: '6', title: 'Sales Representative', description: 'Drive revenue growth through new client acquisition.', requirements: ['Sales experience', 'CRM knowledge', 'Communication skills'], responsibilities: ['Prospect clients', 'Maintain relationships', 'Meet targets'], jobType: 'FULL_TIME', location: 'Denver, CO', salaryMin: 50000, salaryMax: 80000, experienceRequired: 2, skillsRequired: ['sales', 'crm', 'negotiation'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '7', companyId: '7', title: 'Content Creator', description: 'Create engaging content for our social media platforms.', requirements: ['Portfolio', 'Video editing skills', 'Creative mindset'], responsibilities: ['Create content', 'Manage social', 'Analytics'], jobType: 'PART_TIME', location: 'Los Angeles, CA', salaryMin: 45000, salaryMax: 65000, experienceRequired: 2, skillsRequired: ['video-editing', 'content-creation'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '8', companyId: '1', title: 'DevOps Engineer', description: 'Build and maintain cloud infrastructure for our production systems.', requirements: ['AWS experience', 'CI/CD knowledge', '5+ years'], responsibilities: ['Manage cloud', 'Implement CI/CD', 'Security'], jobType: 'FULL_TIME', location: 'Seattle, WA', salaryMin: 110000, salaryMax: 160000, experienceRequired: 4, skillsRequired: ['aws', 'docker', 'kubernetes'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '9', companyId: '8', title: 'UX Designer', description: 'Design intuitive user experiences for our B2B SaaS products.', requirements: ['Figma proficiency', 'User research experience'], responsibilities: ['User research', 'Wireframes', 'Prototypes'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 95000, salaryMax: 140000, experienceRequired: 3, skillsRequired: ['figma', 'user-research'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '10', companyId: '2', title: 'Data Engineer', description: 'Build data pipelines and warehouse solutions.', requirements: ['SQL expertise', 'Python', 'Data modeling'], responsibilities: ['Build pipelines', 'Design models', 'Optimization'], jobType: 'FULL_TIME', location: 'New York, NY', salaryMin: 115000, salaryMax: 155000, experienceRequired: 4, skillsRequired: ['python', 'sql', 'spark'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '11', companyId: '3', title: 'HR Coordinator', description: 'Support HR operations and employee onboarding.', requirements: ['HR degree', '2+ years experience'], responsibilities: ['Onboarding', 'Benefits administration', 'Records'], jobType: 'FULL_TIME', location: 'Chicago, IL', salaryMin: 50000, salaryMax: 65000, experienceRequired: 2, skillsRequired: ['hris', 'recruiting'], status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: '12', companyId: '5', title: 'Frontend Developer - React', description: 'Build beautiful and responsive user interfaces.', requirements: ['React expertise', 'CSS mastery', '3+ years'], responsibilities: ['Build components', 'Implement designs', 'Testing'], jobType: 'FULL_TIME', location: 'San Francisco, CA', salaryMin: 100000, salaryMax: 145000, experienceRequired: 3, skillsRequired: ['react', 'typescript', 'css'], status: 'ACTIVE', createdAt: new Date().toISOString() }
  ],
  companies: [
    { id: '1', name: 'TechCorp Solutions', industry: 'Technology', city: 'San Francisco', state: 'CA', description: 'Leading software development company specializing in enterprise solutions. We build scalable applications for Fortune 500 companies.', logoUrl: null, website: 'https://techcorp.io' },
    { id: '2', name: 'FinanceHub Inc', industry: 'Finance', city: 'New York', state: 'NY', description: 'Modern fintech company revolutionizing personal finance. Our app helps millions manage their finances.', logoUrl: null, website: 'https://financehub.com' },
    { id: '3', name: 'HealthFirst Medical', industry: 'Healthcare', city: 'Boston', state: 'MA', description: 'Patient-centered healthcare provider with 50+ locations. We prioritize quality care and innovation.', logoUrl: null, website: 'https://healthfirst.org' },
    { id: '4', name: 'RetailMax', industry: 'Retail', city: 'Chicago', state: 'IL', description: 'Omnichannel retail leader with 200+ stores. We blend online and offline shopping experiences.', logoUrl: null, website: 'https://retailmax.com' },
    { id: '5', name: 'EduLearn Academy', industry: 'Education', city: 'Austin', state: 'TX', description: 'Online learning platform with 1M+ students. We make education accessible to everyone.', logoUrl: null, website: 'https://edulearn.edu' },
    { id: '6', name: 'GreenEnergy Co', industry: 'Energy', city: 'Denver', state: 'CO', description: 'Sustainable energy solutions provider. We are committed to a greener future.', logoUrl: null, website: 'https://greenenergy.co' },
    { id: '7', name: 'MediaWorks Studio', industry: 'Media', city: 'Los Angeles', state: 'CA', description: 'Creative agency specializing in digital content. We tell stories that matter.', logoUrl: null, website: 'https://mediaworks.studio' },
    { id: '8', name: 'LogiTech Systems', industry: 'Technology', city: 'Seattle', state: 'WA', description: 'Supply chain software company. We optimize logistics for global enterprises.', logoUrl: null, website: 'https://logitechsys.com' }
  ],
  applications: [],
  notifications: []
};

function getData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  setData(defaultData);
  return defaultData;
}

function setData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
}

// Users
export function getUsers() {
  return getData().users;
}

export function getUserById(id) {
  return getData().users.find(u => u.id === id);
}

export function getUserByEmail(email) {
  return getData().users.find(u => u.email === email);
}

export function createUser(user) {
  const data = getData();
  const newUser = { ...user, id: 'user_' + Date.now() };
  data.users.push(newUser);
  setData(data);
  return newUser;
}

export function updateUser(id, updates) {
  const data = getData();
  const index = data.users.findIndex(u => u.id === id);
  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...updates };
    setData(data);
    return data.users[index];
  }
  return null;
}

// Jobs
export function getJobs() {
  return getData().jobs;
}

export function getJobById(id) {
  const job = getData().jobs.find(j => j.id === id);
  if (job) {
    const company = getCompanyById(job.companyId);
    return { ...job, company };
  }
  return null;
}

export function getJobsByCompany(companyId) {
  return getData().jobs.filter(j => j.companyId === companyId);
}

export function getActiveJobs() {
  return getData().jobs.filter(j => j.status === 'ACTIVE');
}

export function getFeaturedJobs() {
  return getData().jobs.filter(j => j.status === 'ACTIVE').slice(0, 6);
}

export function getRelatedJobs(jobId, companyId) {
  return getData().jobs.filter(j => j.companyId === companyId && j.id !== jobId && j.status === 'ACTIVE').slice(0, 3);
}

export function createJob(job) {
  const data = getData();
  const newJob = { ...job, id: 'job_' + Date.now(), createdAt: new Date().toISOString(), status: job.status || 'ACTIVE' };
  data.jobs.push(newJob);
  setData(data);
  return newJob;
}

export function updateJob(id, updates) {
  const data = getData();
  const idx = data.jobs.findIndex(j => j.id === id);
  if (idx !== -1) { data.jobs[idx] = { ...data.jobs[idx], ...updates }; setData(data) }
}

export function deleteJob(id) {
  const data = getData();
  data.jobs = data.jobs.filter(j => j.id !== id);
  data.applications = data.applications.filter(a => a.jobId !== id);
  setData(data);
}

// Companies
export function getCompanies() {
  return getData().companies;
}

export function getCompanyById(id) {
  return getData().companies.find(c => c.id === id);
}

export function createCompany(company) {
  const data = getData();
  const newComp = { ...company, id: 'comp_' + Date.now(), logoUrl: null };
  data.companies.push(newComp);
  setData(data);
  return newComp;
}

export function updateCompany(id, updates) {
  const data = getData();
  const idx = data.companies.findIndex(c => c.id === id);
  if (idx !== -1) { data.companies[idx] = { ...data.companies[idx], ...updates }; setData(data) }
}

export function deleteCompany(id) {
  const data = getData();
  data.companies = data.companies.filter(c => c.id !== id);
  data.jobs = data.jobs.filter(j => j.companyId !== id);
  setData(data);
}

// Applications
export function getApplications() {
  return getData().applications;
}

export function getApplicationsByUser(userId) {
  return getData().applications.filter(a => a.candidateId === userId);
}

export function createApplication(application) {
  const data = getData();
  const newApp = { ...application, id: 'app_' + Date.now(), appliedAt: new Date().toISOString(), status: 'APPLIED' };
  data.applications.push(newApp);
  setData(data);
  return newApp;
}

export function hasApplied(userId, jobId) {
  return getData().applications.some(a => a.candidateId === userId && a.jobId === jobId);
}

// Notifications
export function getNotifications(userId) {
  return getData().notifications.filter(n => n.userId === userId);
}

export function addNotification(notification) {
  const data = getData();
  const newNotif = { ...notification, id: 'notif_' + Date.now(), createdAt: new Date().toISOString(), read: false };
  data.notifications.push(newNotif);
  setData(data);
  return newNotif;
}

// Stats
export function getStats() {
  const data = getData();
  return {
    jobs: data.jobs.filter(j => j.status === 'ACTIVE').length,
    companies: data.companies.length,
    candidates: data.users.filter(u => u.role === 'CANDIDATE').length,
    applications: data.applications.length
  };
}