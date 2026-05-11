import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SavedJobs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
      <div className="text-center py-16"><h3 className="text-xl font-semibold mb-4">No saved jobs</h3><Link to="/jobs"><Button>Browse Jobs</Button></Link></div>
    </div>
  )
}