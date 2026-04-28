import React from 'react'

export default function Linkedin({ size = 24, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="0" y="0" width="24" height="24" rx="4" fill="currentColor" />
      <path
        d="M6.5 9.5H9.2V19H6.5zM7.85 6.9a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2zM11.3 9.5h2.6v1.3h.04c.36-.66 1.24-1.36 2.56-1.36 2.73 0 3.23 1.8 3.23 4.14V19h-2.7v-4.1c0-1-.02-2.3-1.4-2.3-1.4 0-1.62 1.1-1.62 2.23V19h-2.7V9.5z"
        fill="#ffffff"
      />
    </svg>
  )
}
