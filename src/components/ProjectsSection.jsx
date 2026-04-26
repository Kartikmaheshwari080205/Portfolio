import { useEffect, useRef, useState } from 'react'

function ProjectsSection({ projects }) {
  const [orderedProjects, setOrderedProjects] = useState(projects)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const draggedIndexRef = useRef(null)

  useEffect(() => {
    setOrderedProjects(projects)
  }, [projects])

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

    setOrderedProjects((currentProjects) => {
      const nextProjects = [...currentProjects]
      const [draggedProject] = nextProjects.splice(draggedIndex, 1)
      nextProjects.splice(index, 0, draggedProject)
      return nextProjects
    })
  }

  const resetDragState = () => {
    draggedIndexRef.current = null
    setDragOverIndex(null)
    setDraggingIndex(null)
  }

  return (
    <section id="projects" className="card reveal-section">
      <h2 className="section-title">Projects</h2>
      <div className="projects-grid">
        {orderedProjects.map((project, index) => (
          <article
            key={project.name}
            className={`info-tile project-tile ${draggingIndex === index ? 'is-dragging' : ''} ${dragOverIndex === index ? 'is-drag-over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDrop={() => {
              handleDrop(index)
              resetDragState()
            }}
            onDragEnd={resetDragState}
          >
            <h3>{project.name}</h3>

            <p className="project-summary">{project.summary}</p>

            {project.techStack?.length > 0 && (
              <p>
                <strong>Tech:</strong> {project.techStack.join(', ')}
              </p>
            )}

            {project.highlights?.length > 0 && (
              <ul className="project-highlights">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}

            <div className="project-links">
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              )}
              {project.repoLink && (
                <a href={project.repoLink} target="_blank" rel="noreferrer">
                  Repository
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection