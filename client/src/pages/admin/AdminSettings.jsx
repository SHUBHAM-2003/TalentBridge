import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Platform Name</label><Input defaultValue="TalentBridge" className="mt-1" /></div>
            <div><label className="text-sm font-medium">Contact Email</label><Input type="email" defaultValue="admin@talentbridge.com" className="mt-1" /></div>
            <Button onClick={() => toast.success('Settings saved')}>Save Settings</Button>
          </CardContent></Card>
        <Card><CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Current Password</label><Input type="password" className="mt-1" /></div>
            <div><label className="text-sm font-medium">New Password</label><Input type="password" className="mt-1" /></div>
            <Button onClick={() => toast.success('Password changed')}>Change Password</Button>
          </CardContent></Card>
      </div>
    </div>
  )
}