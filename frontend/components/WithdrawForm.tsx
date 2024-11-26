'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function WithdrawForm({ campaignAddress, withdraw }) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const withdrawAmount = parseFloat(amount)
    if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
      withdraw(campaignAddress, withdrawAmount)
      setAmount('')
    } else {
      alert('Please enter a valid withdrawal amount')
    }
  }

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl font-semibold">Withdraw Funds</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="withdrawAmount" className="text-sm sm:text-base">Amount (SOL)</Label>
            <Input
              id="withdrawAmount"
              type="number"
              step="0.000000001"
              min="0"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9 sm:h-10 text-sm sm:text-base"
              required
            />
          </div>
          <Button type="submit" variant="destructive" className="w-full text-sm sm:text-base py-2 sm:py-3">
            Withdraw
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

