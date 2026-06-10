import React, { useEffect, useRef } from 'react'
import { Sparkles, ArrowDown } from 'lucide-react'

const HeroSection = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.1
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }
      draw() {
        ctx.fillStyle = `rgba(229, 9, 20, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section id="hero" className="relative flex items-center justify-center overflow-hidden pt-20 pb-8">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-darker via-netflix-darker/95 to-netflix-darker z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/5 via-transparent to-netflix-red/5 z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-netflix-red/10 rounded-full blur-[120px] z-10" />

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-netflix-red/10 border border-netflix-red/20 rounded-full mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-netflix-red" />
          <span className="text-sm font-medium text-netflix-red">AI-Powered Recommendations</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight animate-fade-in text-shadow">
          Movie Recommendation<span className="block text-netflix-red mt-2">System</span>
        </h1>

        <p className="text-base sm:text-lg text-netflix-gray mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          Discover movies you'll love using advanced Machine Learning algorithms.
          <br className="hidden sm:block" />
          Find your next favorite film in seconds.
        </p>

        <div className="flex items-center justify-center gap-8 sm:gap-12 mb-8 animate-fade-in">
          <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-white">ML</div><div className="text-xs text-netflix-gray uppercase tracking-wider mt-1">Powered</div></div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-white">Fast</div><div className="text-xs text-netflix-gray uppercase tracking-wider mt-1">Results</div></div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-white">Smart</div><div className="text-xs text-netflix-gray uppercase tracking-wider mt-1">Matching</div></div>
        </div>

        <div className="animate-bounce">
          <a href="#search" className="inline-flex items-center gap-2 text-netflix-gray hover:text-white transition-colors duration-200">
            <span className="text-sm">Start Exploring</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-netflix-darker to-transparent z-20" />
    </section>
  )
}

export default HeroSection
