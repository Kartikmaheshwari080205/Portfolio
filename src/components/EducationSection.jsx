function EducationSection({ education }) {
  return (
    <section id="education" className="card reveal-section">
      <h2 className="section-title">Education</h2>
      <div className="section-list">
        {education.map((item) => (
          <article
            key={`${item.college}-${item.from}`}
            className="section-entry education-entry move-card"
          >
            <img
              src={item.collegeImage}
              alt={item.college}
              className="tile-image education-image"
            />

            <div className="education-meta">
              <h3>{item.college}</h3>
              {item.location && <p>{item.location}</p>}
              <p>
                {item.degree} in {item.major}
              </p>
              <p className="timeline">
                {item.from} - {item.to}
              </p>
              <p>{item.cgpaLabel || 'CGPA'}: {item.cgpa}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EducationSection
