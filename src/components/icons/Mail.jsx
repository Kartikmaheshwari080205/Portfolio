import React from 'react'

export default function Mail({ size = 24, className = '', ...props }) {
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
        d="M6 8.5v7h12v-7L12 13 6 8.5zM18 7H6l6 4 6-4z"
        fill="#ffffff"
      />
    </svg>
  )
}
