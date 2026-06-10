import React from 'react'
import { Loader2, Film } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-netflix-red/20 rounded-full blur-xl animate-pulse-slow" />
        <div className="relative w-16 h-16 bg-netflix-card rounded-full flex items-center justify-center border border-white/10">
          <Film className="w-8 h-8 text-netflix-red animate-pulse" />
        </div>
        <Loader2 className="absolute -bottom-1 -right-1 w-6 h-6 text-netflix-red animate-spin" />
      </div>
      <p className="text-lg font-semibold text-white mb-1">Finding recommendations...</p>
      <p className="text-sm text-netflix-gray">Our AI is analyzing movie patterns</p>
    </div>
  )
}

export default LoadingSpinner
