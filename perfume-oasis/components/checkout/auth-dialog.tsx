"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-display text-emerald-palm mb-4">
          Account Required
        </h2>
        
        <p className="text-gray-600 mb-6">
          To complete your purchase, please sign in to your account or create a new one. 
          This helps us provide better service and track your orders.
        </p>
        
        <div className="space-y-3">
          <Link href="/register" className="block">
            <Button className="w-full bg-emerald-palm hover:bg-emerald-palm/90">
              <span>Create Account</span>
            </Button>
          </Link>
          
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              <span>Sign In</span>
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Your cart items will be saved while you sign in
        </p>
      </div>
    </div>
  )
}