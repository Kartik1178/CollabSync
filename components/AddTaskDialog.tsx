// components/AddTaskDialog.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
interface AddTaskDialogProps {
  projectId: string
  members: Array<{ id: string; name: string }>
  onTaskCreated: () => void
}

export default function AddTaskDialog({ projectId, members, onTaskCreated }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    assigneeId: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectId
        })
      })

      if (!res.ok) throw new Error("Failed to create task")
      
      setOpen(false)
      onTaskCreated()
    } catch (err) {
      console.error("Error creating task:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/80 glow">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#1a1a1a] border-[#2a2a2a]"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#1a1a1a] border-[#2a2a2a]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-300">Assignee</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}>
              <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a]">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id} className="hover:bg-[#2a2a2a]">
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/80">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
