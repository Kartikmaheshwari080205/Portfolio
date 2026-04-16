import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
const laneConfigs = [
  { laneTop: 18, duration: 14, delay: 0, scale: 1 },
  { laneTop: 34, duration: 16, delay: 4, scale: 0.94 },
  { laneTop: 52, duration: 15, delay: 8, scale: 1.02 },
  { laneTop: 70, duration: 17, delay: 12, scale: 0.9 },
]

function SkillTrainBackground({ skills }) {
  const sceneRef = useRef(null)
  const carRefs = useRef([])

  const visibleSkills = Array.isArray(skills) && skills.length
    ? skills
    : ['React', 'Node.js', 'Python', 'OpenTelemetry']

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return undefined
    }

    const context = gsap.context(() => {
      carRefs.current.forEach((carNode, index) => {
        const config = laneConfigs[index]
        if (!carNode) {
          return
        }

        gsap.set(carNode, {
          xPercent: -145,
        })

        gsap.to(carNode, {
          xPercent: 145,
          duration: config.duration,
          repeat: -1,
          ease: 'none',
          delay: config.delay,
        })
      })
    }, sceneRef)

    return () => context.revert()
  }, [])

  return (
    <div ref={sceneRef} className="background-car-scene" aria-hidden="true">
      <div className="car-lanes">
        {laneConfigs.map((lane, laneIndex) => (
          <span key={`lane-${laneIndex}`} className="car-lane" style={{ top: `${lane.laneTop}%` }} />
        ))}
      </div>

      {laneConfigs.map((config, laneIndex) => (
        <div
          key={`car-${laneIndex}`}
          ref={(node) => {
            carRefs.current[laneIndex] = node
          }}
          className="car-node"
          style={{ top: `${config.laneTop}%`, '--car-scale': config.scale }}
        >
          <div className="car-instance">
            <div className="car-body" />
            <div className="car-roof" />
            <div className="car-window car-window-front" />
            <div className="car-window car-window-back" />
            <div className="car-headlight" />
            <div className="car-wheel car-wheel-front" />
            <div className="car-wheel car-wheel-back" />
            <span className="car-label">{visibleSkills[laneIndex % visibleSkills.length]}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkillTrainBackground
