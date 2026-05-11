export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' }
]

export const JOB_STATUSES = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'PAUSED', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CLOSED', label: 'Closed', color: 'bg-red-100 text-red-800' },
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' }
]

export const APPLICATION_STATUSES = [
  { value: 'APPLIED', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-green-100 text-green-800' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview', color: 'bg-purple-100 text-purple-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'HIRED', label: 'Hired', color: 'bg-emerald-100 text-emerald-800' }
]

export const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Energy', 'Media', 'Manufacturing', 'Other']

export const EXPERIENCE_LEVELS = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' }
]
