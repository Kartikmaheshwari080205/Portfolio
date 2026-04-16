function getCompanyRange(roles) {
  if (!roles || roles.length === 0) {
    return { from: '', to: '' }
  }

  return {
    from: roles[roles.length - 1].from,
    to: roles[0].to,
  }
}

function ExperienceSection({ experience }) {
  return (
    <section id="experience" className="card reveal-section">
      <h2 className="section-title">Experience</h2>
      <div className="section-list">
        {experience.map((company) => (
          <article key={company.company} className="section-entry experience-entry move-card">
            <div className="experience-top">
              <div className="experience-main">
                <img
                  src={company.companyLogo}
                  alt={company.company}
                  className="logo-image"
                />
                <div className="experience-meta">
                  <h3>{company.company}</h3>
                  <p>{company.location}</p>
                </div>
              </div>
              <p className="timeline experience-duration">
                {getCompanyRange(company.roles).from} - {getCompanyRange(company.roles).to}
              </p>
            </div>

            <div className="roles-stack">
              {company.roles.map((role) => (
                <div key={`${role.title}-${role.from}`} className="role-item">
                  <p className="role-title">{role.title}</p>
                  <p className="timeline">
                    {role.from} - {role.to}
                  </p>
                  <ul className="role-list">
                    {role.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection
