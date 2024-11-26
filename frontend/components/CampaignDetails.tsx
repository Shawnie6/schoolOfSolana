'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ExternalLink } from 'lucide-react'
import DonateForm from './DonateForm'

export default function CampaignDetails({ campaign, donate }) {
  const amountDonated = campaign.amountDonated?.toNumber() || 0
  const targetAmount = campaign.targetAmount?.toNumber() || 1
  const progress = (amountDonated / targetAmount) * 100

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl font-semibold">{campaign.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img 
            src={campaign.projectImageUrl} 
            alt={campaign.name} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <p className="text-sm sm:text-base text-gray-600">{campaign.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Progress ({progress.toFixed(1)}%)</span>
            <span>{amountDonated / 1e9} / {targetAmount / 1e9} SOL</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="grid gap-2">
          <a 
            href={campaign.projectUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:underline"
          >
            Project Website <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </a>
          <a 
            href={campaign.progressUpdateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:underline"
          >
            Progress Updates <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </a>
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            {campaign.category}
          </span>
        </div>

        <div className="mt-4 sm:mt-6">
          <DonateForm campaignAddress={campaign.pubkey} donate={donate} />
        </div>
      </CardContent>
    </Card>
  )
}

