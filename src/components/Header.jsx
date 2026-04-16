import {
  Briefcase,
  Code2,
  GraduationCap,
  Home,
  Mail,
  Moon,
  Sun,
} from 'lucide-react'

const sectionIcons = {
  introduction: Home,
  education: GraduationCap,
  experience: Briefcase,
  'competitive-programming': Code2,
  contact: Mail,
}

function Header({ name, title, sections, theme, onThemeToggle }) {
  const handleSectionJump = (event, sectionId) => {
    event.preventDefault()

    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const cleanUrl = `${window.location.pathname}${window.location.search}`
    window.history.replaceState(null, '', cleanUrl)
  }

  return (
    <header className="top-bar">
      <div>
        <p className="brand-name">{name}</p>
        <p className="brand-title">{title}</p>
      </div>

      <div className="toolbar-wrap">
        <nav className="nav-links" aria-label="Section navigation">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleSectionJump(event, section.id)}
              aria-label={section.label}
              title={section.label}
              className="nav-icon-link"
            >
              {(() => {
                const Icon = sectionIcons[section.id] || Home
                return <Icon size={30} aria-hidden="true" />
              })()}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  )
}

export default Header
