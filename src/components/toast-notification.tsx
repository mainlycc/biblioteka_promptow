"use client"

import { useEffect } from "react"
import { toast } from "sonner"

interface ToastNotificationProps {
  message: string
  show: boolean
  onClose: () => void
}

export function ToastNotification({ message, show, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (show) {
      toast(message, {
        duration: 2000,
      })
      onClose()
    }
  }, [show, message, onClose])

  return null
} 