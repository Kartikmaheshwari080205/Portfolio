import { useEffect, useRef, useState } from 'react'

function CodingPlatformsSection({ competitiveProfiles }) {
  const [orderedProfiles, setOrderedProfiles] = useState(competitiveProfiles)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const draggedIndexRef = useRef(null)

  useEffect(() => {
    setOrderedProfiles(competitiveProfiles)
  }, [competitiveProfiles])

  const handleDragStart = (index) => {
    draggedIndexRef.current = index
    setDraggingIndex(index)
  }

  const handleDragOver = (event, index) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDrop = (index) => {
    const draggedIndex = draggedIndexRef.current

    if (draggedIndex === null || draggedIndex === index) {
      return
    }

    setOrderedProfiles((currentProfiles) => {
      const nextProfiles = [...currentProfiles]
      const [draggedProfile] = nextProfiles.splice(draggedIndex, 1)
      nextProfiles.splice(index, 0, draggedProfile)
      return nextProfiles
    })
  }

  const resetDragState = () => {
    draggedIndexRef.current = null
    setDragOverIndex(null)
    setDraggingIndex(null)
  }

  return (
    <section id="competitive-programming" className="card reveal-section">
      <h2 className="section-title">Coding Platforms</h2>
      <div className="cp-grid">
        {orderedProfiles.map((profile, index) => (
          <article
            key={profile.platform}
            className={`info-tile cp-tile ${draggingIndex === index ? 'is-dragging' : ''} ${dragOverIndex === index ? 'is-drag-over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDrop={() => {
              handleDrop(index)
              resetDragState()
            }}
            onDragEnd={resetDragState}
          >
            <div className="cp-layout">
              <img
                src={profile.logo}
                alt={`${profile.platform} logo`}
                className="logo-image cp-logo"
              />
              <div className="cp-meta">
                <h3>
                  <a
                    className="cp-name-link"
                    href={profile.profileLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.platform}
                  </a>
                </h3>
                {profile.rating && <p>Rating: {profile.rating}</p>}
                {profile.bestMetricLabel && (
                  <p>
                    {profile.bestMetricLabel}: {profile.bestMetricValue}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CodingPlatformsSection
