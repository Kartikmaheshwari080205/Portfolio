import { useEffect, useRef } from 'react'

function Antigravity({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#5227FF',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10,
  maxFps = 40,
  maxDpr = 1.25,
  className = '',
}) {
  const hostRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return undefined
    }

    let rafId = 0
    let width = 1
    let height = 1
    let lastTimestamp = 0
    const frameInterval = 1000 / Math.max(10, Number(maxFps) || 40)

    const makeParticles = () => {
      const amount = Math.max(10, Number(count) || 300)
      const variance = Math.max(0, Number(particleVariance) || 0)
      const depth = Math.max(0.2, Number(depthFactor) || 1)

      particlesRef.current = Array.from({ length: amount }, (_, index) => {
        const x = Math.random() * width
        const y = Math.random() * height
        const baseScale = 0.75 + Math.random() * (0.45 + variance * 0.35)
        const layer = 0.5 + Math.random() * depth

        return {
          index,
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          scale: baseScale,
          layer,
          phase: Math.random() * Math.PI * 2,
          spin: Math.random() * Math.PI * 2,
        }
      })
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(
        Math.max(1, Number(maxDpr) || 1.25),
        Math.max(1, window.devicePixelRatio || 1),
      )

      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeParticles()
    }

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect()
      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top

      pointerRef.current.x = localX
      pointerRef.current.y = localY
      pointerRef.current.active = (
        localX >= 0
        && localX <= rect.width
        && localY >= 0
        && localY <= rect.height
      )
    }

    const onPointerLeave = () => {
      pointerRef.current.active = false
    }

    const drawParticle = (particle, pulse, timeSeconds) => {
      const size = Math.max(0.5, particleSize * particle.scale * (0.8 + pulse * 0.2))
      const alpha = Math.min(0.95, 0.24 + particle.layer * 0.48)

      context.save()
      context.translate(particle.x, particle.y)

      if (particleShape === 'capsule') {
        const rotSpeed = Number(rotationSpeed) || 0
        const dynamicAngle = rotSpeed === 0
          ? Math.atan2(particle.vy, particle.vx) * 0.35
          : particle.spin + timeSeconds * rotSpeed
        context.rotate(dynamicAngle)
      }

      context.fillStyle = color
      context.globalAlpha = alpha

      if (particleShape === 'square') {
        context.fillRect(-size * 0.5, -size * 0.5, size, size)
      } else if (particleShape === 'circle') {
        context.beginPath()
        context.arc(0, 0, size * 0.55, 0, Math.PI * 2)
        context.fill()
      } else {
        const capsuleWidth = size * 1.8
        const capsuleHeight = size
        const radius = capsuleHeight * 0.5

        context.beginPath()
        context.moveTo(-capsuleWidth * 0.5 + radius, -capsuleHeight * 0.5)
        context.lineTo(capsuleWidth * 0.5 - radius, -capsuleHeight * 0.5)
        context.arcTo(capsuleWidth * 0.5, -capsuleHeight * 0.5, capsuleWidth * 0.5, capsuleHeight * 0.5, radius)
        context.lineTo(capsuleWidth * 0.5, capsuleHeight * 0.5 - radius)
        context.arcTo(capsuleWidth * 0.5, capsuleHeight * 0.5, -capsuleWidth * 0.5, capsuleHeight * 0.5, radius)
        context.lineTo(-capsuleWidth * 0.5 + radius, capsuleHeight * 0.5)
        context.arcTo(-capsuleWidth * 0.5, capsuleHeight * 0.5, -capsuleWidth * 0.5, -capsuleHeight * 0.5, radius)
        context.lineTo(-capsuleWidth * 0.5, -capsuleHeight * 0.5 + radius)
        context.arcTo(-capsuleWidth * 0.5, -capsuleHeight * 0.5, capsuleWidth * 0.5, -capsuleHeight * 0.5, radius)
        context.closePath()
        context.fill()
      }

      context.restore()
    }

    const step = (timestamp) => {
      if (document.hidden) {
        rafId = window.requestAnimationFrame(step)
        return
      }

      if (lastTimestamp && (timestamp - lastTimestamp) < frameInterval) {
        rafId = window.requestAnimationFrame(step)
        return
      }

      const timeSeconds = timestamp * 0.001
      const delta = Math.min(0.05, (timestamp - (lastTimestamp || timestamp)) / 1000)
      lastTimestamp = timestamp

      context.clearRect(0, 0, width, height)

      const particles = particlesRef.current
      const pulse = 0.6 + 0.4 * Math.sin(timeSeconds * pulseSpeed)
      const pointer = pointerRef.current
      const magnetPx = Math.max(30, magnetRadius * 24)
      const ringPx = Math.max(36, ringRadius * 24)
      const strength = Math.max(0.1, fieldStrength * 0.55)
      const homeFactor = Math.max(0.002, lerpSpeed * 0.11)
      const wavePush = Math.max(0, waveAmplitude) * 0.12

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i]
        const dxHome = particle.homeX - particle.x
        const dyHome = particle.homeY - particle.y

        particle.vx += dxHome * homeFactor
        particle.vy += dyHome * homeFactor

        const wave = Math.sin(timeSeconds * waveSpeed * 2.2 + particle.phase)
        particle.vx += wave * wavePush * 0.35 * particle.layer
        particle.vy += wave * wavePush * 0.65 * particle.layer

        if (pointer.active) {
          const dx = pointer.x - particle.x
          const dy = pointer.y - particle.y
          const distance = Math.hypot(dx, dy) || 1

          if (distance < magnetPx) {
            const pull = (1 - distance / magnetPx) * strength
            particle.vx += (dx / distance) * pull * 0.03
            particle.vy += (dy / distance) * pull * 0.03
          } else if (distance < ringPx) {
            const tangentialX = -dy / distance
            const tangentialY = dx / distance
            const swirl = (1 - (distance - magnetPx) / Math.max(1, ringPx - magnetPx)) * strength
            particle.vx += tangentialX * swirl * 0.01
            particle.vy += tangentialY * swirl * 0.01
          }
        }

        particle.vx *= 0.93
        particle.vy *= 0.93

        particle.x += particle.vx * (delta * 60)
        particle.y += particle.vy * (delta * 60)

        if (particle.x < -16) particle.x = width + 16
        if (particle.x > width + 16) particle.x = -16
        if (particle.y < -16) particle.y = height + 16
        if (particle.y > height + 16) particle.y = -16

        drawParticle(particle, pulse, timeSeconds)
      }

      rafId = window.requestAnimationFrame(step)
    }

    resize()

    if (autoAnimate) {
      rafId = window.requestAnimationFrame(step)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
      window.cancelAnimationFrame(rafId)
    }
  }, [
    autoAnimate,
    color,
    count,
    depthFactor,
    fieldStrength,
    lerpSpeed,
    magnetRadius,
    particleShape,
    particleSize,
    particleVariance,
    pulseSpeed,
    ringRadius,
    rotationSpeed,
    waveAmplitude,
    waveSpeed,
    maxFps,
    maxDpr,
  ])

  return (
    <div
      ref={hostRef}
      className={`antigravity-canvas-wrap ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="antigravity-canvas" />
    </div>
  )
}

export default Antigravity
