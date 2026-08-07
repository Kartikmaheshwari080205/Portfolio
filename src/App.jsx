import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import IntroductionSection from './components/IntroductionSection'
import Antigravity from './components/Antigravity'
import EducationSection from './components/EducationSection'
import ExperienceSection from './components/ExperienceSection'
import CodingPlatformsSection from './components/CodingPlatformsSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import './App.css'

const fetchCodeforcesStats = async (handle) => {
  const response = await fetch(
    `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
  )

  if (!response.ok) {
    return null
  }

  const payload = await response.json()

  if (payload.status !== 'OK' || !Array.isArray(payload.result) || payload.result.length === 0) {
    return null
  }

  return payload.result[0]
}

const getPlatformHandle = (profileLink) => {
  if (!profileLink) {
    return ''
  }

  try {
    const { pathname } = new URL(profileLink)
    const segments = pathname.split('/').filter(Boolean)

    return segments[segments.length - 1] || ''
  } catch {
    return ''
  }
}

const fetchCodermeStats = async (platform, handle) => {
  const response = await fetch(
    `https://coderme.crimsontwilight.in/${platform}/${encodeURIComponent(handle)}`,
  )

  if (!response.ok) {
    return null
  }

  const payload = await response.json()

  if (typeof payload?.rating !== 'number') {
    return null
  }

  return payload
}

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
        const [profileRes, educationRes, experienceRes, competitiveRes, projectsRes, contactRes] =
          await Promise.all([
            fetch('/data/profile.json'),
            fetch('/data/education.json'),
            fetch('/data/experience.json'),
            fetch('/data/competitive-profiles.json'),
            fetch('/data/projects.json'),
            fetch('/data/contact.json'),
          ])

        const allResponses = [
          profileRes,
          educationRes,
          experienceRes,
          competitiveRes,
          projectsRes,
          contactRes,
        ]

        if (allResponses.some((res) => !res.ok)) {
          throw new Error('Could not load one or more section data files.')
        }

        const [profileJson, educationJson, experienceJson, competitiveJson, projectsJson, contactJson] =
          await Promise.all(allResponses.map((res) => res.json()))

        const competitiveProfiles = await Promise.all(
          competitiveJson.map(async (profile) => {
            if (profile.platform === 'Codeforces') {
              const handle = getPlatformHandle(profile.profileLink)

              if (!handle) {
                return profile
              }

              try {
                const codeforcesStats = await fetchCodeforcesStats(handle)

                if (!codeforcesStats) {
                  return profile
                }

                return {
                  ...profile,
                  rating: codeforcesStats.rating?.toString() || 'Unrated',
                  bestMetricLabel: 'Max Rating',
                  bestMetricValue: codeforcesStats.maxRating?.toString() || profile.bestMetricValue,
                }
              } catch {
                return profile
              }
            }

            if (profile.platform !== 'CodeChef' && profile.platform !== 'LeetCode') {
              return profile
            }

            const handle = getPlatformHandle(profile.profileLink)

            if (!handle) {
              return profile
            }

            try {
              const codermeStats = await fetchCodermeStats(
                profile.platform.toLowerCase(),
                handle,
              )

              if (!codermeStats) {
                return profile
              }

              return {
                ...profile,
                rating: codermeStats.rating.toString(),
                bestMetricLabel: profile.bestMetricLabel,
                bestMetricValue: profile.bestMetricValue,
              }
            } catch {
              return profile
            }
          }),
        )

        setData({
          ...profileJson,
          education: educationJson,
          experience: experienceJson,
          competitiveProfiles,
          projects: projectsJson,
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
      { id: 'projects', label: 'Projects' },
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

  const {
    intro,
    education,
    experience,
    competitiveProfiles,
    projects,
    contact,
    name,
    title,
    resumeUrl,
  } = data
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
        resumeUrl={resumeUrl}
        onThemeToggle={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />

      <main className="content-wrap">
        <IntroductionSection intro={intro} name={name} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
        <CodingPlatformsSection competitiveProfiles={competitiveProfiles} theme={theme} />
        <ProjectsSection projects={projects} />
        <ContactSection contact={contact} />
      </main>
      </div>
    </>
  )
}

export default App
