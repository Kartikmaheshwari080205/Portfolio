function CodingPlatformsSection({ competitiveProfiles }) {
  return (
    <section id="competitive-programming" className="card reveal-section">
      <h2 className="section-title">Coding Platforms</h2>
      <div className="cp-grid">
        {competitiveProfiles.map((profile) => (
          <article key={profile.platform} className="info-tile cp-tile">
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
