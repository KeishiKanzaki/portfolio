import { useState, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Simple toast implementation
let toastContainer: HTMLDivElement | null = null

function createToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

function showToast(props: ToastProps) {
  const container = createToastContainer()
  const toastElement = document.createElement("div")
  const id = Math.random().toString(36).substr(2, 9)
  
  toastElement.className = `relative p-4 rounded-md shadow-lg border transition-all duration-300 ${
    props.variant === "destructive"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-green-50 border-green-200 text-green-800"
  }`
  
  let content = ""
  if (props.title) {
    content += `<div class="font-semibold text-sm">${props.title}</div>`
  }
  if (props.description) {
    content += `<div class="text-sm mt-1">${props.description}</div>`
  }
  content += `<button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">×</button>`
  
  toastElement.innerHTML = content
  
  // Add click handler for close button
  const closeButton = toastElement.querySelector("button")
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      toastElement.remove()
    })
  }
  
  container.appendChild(toastElement)
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toastElement.parentNode) {
      toastElement.remove()
    }
  }, 3000)
}

export function useToast() {
  const toast = useCallback((props: ToastProps) => {
    showToast(props)
  }, [])
  
  return { toast }
}