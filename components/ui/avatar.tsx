import * as React from "react"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  children?: React.ReactNode
  className?: string
}

export function Avatar({ src, alt, children, className = "", ...props }: AvatarProps) {
  return (
    <div className={`relative inline-block rounded-full overflow-hidden bg-gray-200 ${className}`} {...props}>
      {src ? (
        <img src={src} alt={alt ?? "avatar"} className="w-full h-full object-cover" />
      ) : (
        children
      )}
    </div>
  )
}

export function AvatarImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <img src={src} alt={alt ?? "avatar"} className="w-full h-full object-cover" />
  )
}

export function AvatarFallback({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full h-full text-gray-500 bg-gray-100 ${className}`}>
      {children}
    </div>
  )
}
