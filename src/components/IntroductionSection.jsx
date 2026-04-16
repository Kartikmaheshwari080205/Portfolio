import { Home, MapPin } from 'lucide-react'

function IntroductionSection({ intro, name }) {
  return (
    <section id="introduction" className="card intro-card reveal-section">
      <div className="intro-atmosphere" aria-hidden="true" />
      <img
        src={intro.profileImage}
        alt={`${name} profile`}
        className="intro-image"
      />
      <div className="intro-content">
        <h1 className="section-title">{name}</h1>
        <p className="intro-text">{intro.description}</p>
        <p className="intro-meta">
          <Home size={16} aria-hidden="true" />
          <span>{intro.hometown}</span>
        </p>
        <p className="intro-meta">
          <MapPin size={16} aria-hidden="true" />
          <span>{intro.currentLocation}</span>
        </p>
      </div>
    </section>
  )
}

export default IntroductionSection
