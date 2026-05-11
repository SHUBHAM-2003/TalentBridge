export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
export const formatSalary = (min, max, currency = 'USD') => {
  const fmt = n => n ? `$${(n/1000).toFixed(0)}k` : ''
  return `${fmt(min)} - ${fmt(max)}`
}
export const truncate = (str, len = 100) => str?.length > len ? str.slice(0, len) + '...' : str
export const slugify = (str) => str?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || ''
export const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || ''
export const isNew = (date) => (Date.now() - new Date(date)) < 48 * 60 * 60 * 1000
export const isUrgent = (deadline) => deadline && (new Date(deadline) - Date.now()) < 7 * 24 * 60 * 60 * 1000
