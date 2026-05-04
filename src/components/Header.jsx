import { useState } from 'react'
import {
  Briefcase,
  Download,
  Code2,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  FileText,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'

const sectionIcons = {
  introduction: Home,
  education: GraduationCap,
  experience: Briefcase,
  'competitive-programming': Code2,
  projects: FolderKanban,
  contact: Mail,
}

function Header({ name, title, sections, theme, onThemeToggle, resumeUrl }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const resumeHref = resumeUrl || '/resume/Kartik_Maheshwari_Resume.pdf'

  const handleSectionJump = (event, sectionId) => {
    event.preventDefault()

    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const cleanUrl = `${window.location.pathname}${window.location.search}`
    window.history.replaceState(null, '', cleanUrl)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="top-bar">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size="1.4rem" /> : <Menu size="1.4rem" />}
        </button>

        <div className="brand-section">
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
                  return <Icon size="1.2rem" aria-hidden="true" />
                })()}
              </a>
            ))}
            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              aria-label="View resume"
              title="View resume"
              className="nav-icon-link resume-nav-link"
            >
              <FileText size="1.2rem" aria-hidden="true" />
            </a>
            <a
              href={resumeHref}
              download
              aria-label="Download resume"
              title="Download resume"
              className="nav-icon-link resume-nav-link"
            >
              <Download size="1.2rem" aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size="1rem" /> : <Sun size="1rem" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay open"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile section navigation"
        aria-hidden={!mobileMenuOpen}
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(event) => handleSectionJump(event, section.id)}
            aria-label={section.label}
            className="mobile-menu-link"
          >
            {(() => {
              const Icon = sectionIcons[section.id] || Home
              return (
                <>
                  <Icon size="1.2rem" aria-hidden="true" />
                  <span>{section.label}</span>
                </>
              )
            })()}
          </a>
        ))}
        <a
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          aria-label="View resume"
          className="mobile-menu-link"
        >
          <FileText size="1.2rem" aria-hidden="true" />
          <span>Resume</span>
        </a>
        <a
          href={resumeHref}
          download
          aria-label="Download resume"
          className="mobile-menu-link"
        >
          <Download size="1.2rem" aria-hidden="true" />
          <span>Download Resume</span>
        </a>
      </nav>
    </>
  )
}

export default Header
