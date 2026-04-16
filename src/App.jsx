import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import IntroductionSection from './components/IntroductionSection'
import Antigravity from './components/Antigravity'
import EducationSection from './components/EducationSection'
import ExperienceSection from './components/ExperienceSection'
import CodingPlatformsSection from './components/CodingPlatformsSection'
import ContactSection from './components/ContactSection'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const scrollProgressRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')

    if (savedTheme) {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, educationRes, experienceRes, competitiveRes, contactRes] =
          await Promise.all([
            fetch('/data/profile.json'),
            fetch('/data/education.json'),
            fetch('/data/experience.json'),
            fetch('/data/competitive-profiles.json'),
            fetch('/data/contact.json'),
          ])

        const allResponses = [
          profileRes,
          educationRes,
          experienceRes,
          competitiveRes,
          contactRes,
        ]

        if (allResponses.some((res) => !res.ok)) {
          throw new Error('Could not load one or more section data files.')
        }

        const [profileJson, educationJson, experienceJson, competitiveJson, contactJson] =
          await Promise.all(allResponses.map((res) => res.json()))

        setData({
          ...profileJson,
          education: educationJson,
          experience: experienceJson,
          competitiveProfiles: competitiveJson,
          contact: contactJson,
        })
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const observedSections = document.querySelectorAll('.reveal-section')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('in-view', entry.isIntersecting)
        })
      },
      { threshold: 0.18 },
    )

    observedSections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [data])

  useEffect(() => {
    let animationFrameId = 0
    let isTicking = false

    const updateScrollProgress = () => {
      const progressBar = scrollProgressRef.current
      if (!progressBar) {
        return
      }

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      let progress = 1

      if (scrollableHeight > 0) {
        progress = Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
      }

      progressBar.style.transform = `scaleX(${progress})`
    }

    const onScrollOrResize = () => {
      if (isTicking) {
        return
      }

      isTicking = true
      animationFrameId = window.requestAnimationFrame(() => {
        updateScrollProgress()
        isTicking = false
      })
    }

    updateScrollProgress()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const sections = useMemo(
    () => [
      { id: 'introduction', label: 'Introduction' },
      { id: 'education', label: 'Education' },
      { id: 'experience', label: 'Experience' },
      { id: 'competitive-programming', label: 'Coding Platforms' },
      { id: 'contact', label: 'Contact' },
    ],
    [],
  )

  if (loading) {
    return <p className="status-message">Loading portfolio...</p>
  }

  if (error || !data) {
    return (
      <p className="status-message error-text">
        {error || 'Portfolio data is not available.'}
      </p>
    )
  }

  const { intro, education, experience, competitiveProfiles, contact, name, title } =
    data
  const antigravityColor = theme === 'light' ? '#7a2d61' : '#b67cff'

  return (
    <>
      <div className="page-antigravity-bg" aria-hidden="true">
        <Antigravity
          count={550}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={2.1}
          lerpSpeed={0.05}
          color={antigravityColor}
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
          maxFps={36}
          maxDpr={1.15}
          className="antigravity-canvas-wrap-bg"
        />
      </div>

      <div className="app-shell">
      <div ref={scrollProgressRef} className="scroll-progress" aria-hidden="true" />

      <Header
        name={name}
        title={title}
        sections={sections}
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />

      <main className="content-wrap">
        <IntroductionSection intro={intro} name={name} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
        <CodingPlatformsSection competitiveProfiles={competitiveProfiles} />
        <ContactSection contact={contact} />
      </main>
      </div>
    </>
  )
}

export default App
