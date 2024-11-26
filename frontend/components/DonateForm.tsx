'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function DonateForm({ campaignAddress, donate }) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const donationAmount = parseFloat(amount)
    if (!isNaN(donationAmount) && donationAmount > 0) {
      donate(campaignAddress, donationAmount)
      setAmount('')
    } else {
      alert('Please enter a valid donation amount')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="text-xl font-semibold">Support this Campaign</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-sm sm:text-base">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000000001"
              min="0"
              placeholder="Enter amount to donate"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9 sm:h-10 text-sm sm:text-base"
              required
            />
          </div>
          <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3">
            Donate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

