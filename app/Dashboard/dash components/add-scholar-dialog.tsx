import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from 'lucide-react'

interface AddScholarDialogProps {
  onSubmit: (scholarData: any) => Promise<void>
  isLoading: boolean
}

export function AddScholarDialog({ onSubmit, isLoading }: AddScholarDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    axieId: '',
    managerShare: '',
    scholarShare: '0',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      if (name === 'managerShare') {
        const managerShare = parseInt(value) || 0
        newData.scholarShare = (100 - managerShare).toString()
      }
      if (name === 'axieId') {
        newData.axieId = value
      }
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name: `${formData.firstName} ${formData.lastName}`,
      axieId: formData.axieId,
      share: {
        manager: parseInt(formData.managerShare),
        scholar: parseInt(formData.scholarShare)
      }
    })
    setIsOpen(false)
    setFormData({
      firstName: '',
      lastName: '',
      axieId: '',
      managerShare: '',
      scholarShare: '0',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto px-[.5rem] h-[33px] drop-shadow-[0_2px_2px_gray]">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-center">
          <DialogTitle className="font-bold">Add New Scholar</DialogTitle>
          <p className="text-[11px]">Provide a valid input below.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Form fields */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Scholar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

