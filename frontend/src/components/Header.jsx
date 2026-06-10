import React from 'react'
import { Film, Github, Info } from 'lucide-react'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Film className="w-8 h-8 text-netflix-red transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-netflix-red/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">MovieRec</span>
              <span className="text-[10px] text-netflix-gray -mt-1 tracking-wider uppercase">AI Powered</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6">
            <a href="#hero" className="text-sm text-netflix-light hover:text-white transition-colors duration-200">Home</a>
            <a href="#search" className="text-sm text-netflix-light hover:text-white transition-colors duration-200">Discover</a>
            <a href="#results" className="text-sm text-netflix-light hover:text-white transition-colors duration-200">Recommendations</a>
          </nav>

          
        </div>
      </div>
    </header>
  )
}

export default Header
