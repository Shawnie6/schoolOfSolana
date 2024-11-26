'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CreateCampaign({ createCampaign }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [progressUpdateUrl, setProgressUpdateUrl] = useState('')
  const [projectImageUrl, setProjectImageUrl] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    createCampaign({
      name,
      description,
      targetAmount: parseFloat(targetAmount),
      projectUrl,
      progressUpdateUrl,
      projectImageUrl,
      category,
    })
    
    // Reset form after submission
    setName('')
    setDescription('')
    setTargetAmount('')
    setProjectUrl('')
    setProgressUpdateUrl('')
    setProjectImageUrl('')
    setCategory('')
  }

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="space-y-1 border-b px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl font-semibold">Create Campaign</CardTitle>
        <CardDescription className="text-sm sm:text-base">Launch a new campaign on Solana</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Campaign Name</Label>
              <Input
                id="name"
                placeholder="Enter campaign name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 sm:h-10 text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAmount" className="text-sm sm:text-base">Target Amount (SOL)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.1"
                placeholder="Enter target amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="h-9 sm:h-10 text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectUrl" className="text-sm sm:text-base">Project URL</Label>
              <Input
                id="projectUrl"
                type="url"
                placeholder="https://your-project.com"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="h-9 sm:h-10 text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progressUpdateUrl" className="text-sm sm:text-base">Progress Update URL</Label>
              <Input
                id="progressUpdateUrl"
                type="url"
                placeholder="https://updates.your-project.com"
                value={progressUpdateUrl}
                onChange={(e) => setProgressUpdateUrl(e.target.value)}
                className="h-9 sm:h-10 text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectImageUrl" className="text-sm sm:text-base">Project Image URL</Label>
              <Input
                id="projectImageUrl"
                type="url"
                placeholder="https://image-url.com"
                value={projectImageUrl}
                onChange={(e) => setProjectImageUrl(e.target.value)}
                className="h-9 sm:h-10 text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
              <Input
                id="category"
                placeholder="Enter project category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 sm:h-10 text-sm sm:text-base"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3">
            Create Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

