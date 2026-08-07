import { useEffect, useMemo, useState } from 'react'
import { Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

ChartJS.register(LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend)

const codeforcesBands = [
  { label: 'Newbie', min: 0, max: 1199, color: '#808080' },
  { label: 'Pupil', min: 1200, max: 1399, color: '#008000' },
  { label: 'Specialist', min: 1400, max: 1599, color: '#03A89E' },
  { label: 'Expert', min: 1600, max: 1899, color: '#0000FF' },
  { label: 'Candidate Master', min: 1900, max: 2099, color: '#AA00AA' },
  { label: 'Master', min: 2100, max: 2299, color: '#FF8000' },
  { label: 'International Master', min: 2300, max: 2399, color: '#FF8000' },
  { label: 'Grandmaster', min: 2400, max: 2599, color: '#FF0000' },
  { label: 'International Grandmaster', min: 2600, max: 2999, color: '#FF0000' },
  { label: 'Legendary Grandmaster', min: 3000, max: 10000, color: '#FF0000' },
]

const getRatingColor = (rating) => {
  if (rating >= 2400) return '#FF0000'
  if (rating >= 2100) return '#FF8000'
  if (rating >= 1900) return '#AA00AA'
  if (rating >= 1600) return '#0000FF'
  if (rating >= 1400) return '#03A89E'
  if (rating >= 1200) return '#008000'
  return '#808080'
}

const getChartColors = (theme) => {
  if (theme === 'dark') {
    return {
      text: '#f1e8ff',
    }
  }

  return {
    text: '#421c37',
  }
}

const codeforcesBandsPlugin = {
  id: 'codeforcesBands',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart

    if (!chartArea || !scales.y) {
      return
    }

    const { top, bottom, left, right } = chartArea
    const { y } = scales

    ctx.save()

    codeforcesBands.forEach((band) => {
      const upper = Math.min(band.max, y.max)
      const lower = Math.max(band.min, y.min)

      if (upper <= lower) {
        return
      }

      const bandTop = y.getPixelForValue(upper)
      const bandBottom = y.getPixelForValue(lower)
      const fillTop = Math.max(top, Math.min(bandTop, bottom))
      const fillBottom = Math.max(top, Math.min(bandBottom, bottom))

      ctx.globalAlpha = 0.2
      ctx.fillStyle = band.color
      ctx.fillRect(left, fillTop, right - left, fillBottom - fillTop)

      ctx.strokeStyle = `${band.color}55`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(left, fillTop)
      ctx.lineTo(right, fillTop)
      ctx.stroke()
    })

    ctx.restore()
  },
}

function CodeforcesGraph({ handle, theme }) {
  const [ratingHistory, setRatingHistory] = useState([])
  const [loading, setLoading] = useState(Boolean(handle))
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!handle) {
      setRatingHistory([])
      setLoading(false)
      setError('')
      return undefined
    }

    const controller = new AbortController()

    const loadRatingHistory = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Unable to load Codeforces rating history.')
        }

        const payload = await response.json()

        if (payload.status !== 'OK' || !Array.isArray(payload.result)) {
          throw new Error('Codeforces returned an unexpected rating history response.')
        }

        setRatingHistory(payload.result)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load Codeforces rating history.')
          setRatingHistory([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadRatingHistory()

    return () => controller.abort()
  }, [handle, reloadKey])

  const chartData = useMemo(() => {
    const points = ratingHistory
      .slice()
      .sort((leftEntry, rightEntry) => leftEntry.ratingUpdateTimeSeconds - rightEntry.ratingUpdateTimeSeconds)
      .map((entry) => ({
        x: entry.ratingUpdateTimeSeconds * 1000,
        y: entry.newRating,
        contestName: entry.contestName,
        rank: entry.rank,
        oldRating: entry.oldRating,
        newRating: entry.newRating,
      }))

    return {
      datasets: [
        {
          label: 'Rating',
          data: points,
          borderColor: '#3B5998',
          borderWidth: 2,
          tension: 0,
          pointRadius: 3,
          pointHoverRadius: 4,
          pointBorderWidth: 1,
          pointBorderColor: '#ffffff',
          pointBackgroundColor: points.map((point) => getRatingColor(point.y)),
          pointHoverBorderColor: '#ffffff',
          pointHoverBackgroundColor: points.map((point) => getRatingColor(point.y)),
          fill: false,
        },
      ],
    }
  }, [ratingHistory])

  const chartOptions = useMemo(() => {
    const chartColors = getChartColors(theme)
    const ratings = ratingHistory
      .map((entry) => entry.newRating)
      .filter((rating) => Number.isFinite(rating))
    const lowestRating = Math.min(...ratings)
    const highestRating = Math.max(...ratings)
    const yMin = Math.max(0, Math.floor((lowestRating - 150) / 100) * 100)
    const yMax = Math.ceil((highestRating + 150) / 100) * 100

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(20, 14, 34, 0.96)',
          titleColor: '#ffffff',
          bodyColor: '#f4ecff',
          borderColor: '#3B5998',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title(items) {
              return items[0]?.raw?.contestName || ''
            },
            label(context) {
              const { raw } = context

              return [
                `Rank: ${raw.rank}`,
                `Rating: ${raw.oldRating} → ${raw.newRating}`,
                `Date: ${new Date(raw.x).toLocaleDateString()}`,
              ]
            },
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            tooltipFormat: 'MMM d, yyyy',
            unit: 'month',
          },
          grid: {
            display: false,
          },
          ticks: {
            color: chartColors.text,
            maxRotation: 0,
            autoSkip: true,
          },
        },
        y: {
          min: yMin,
          max: yMax,
          grid: {
            display: false,
          },
          ticks: {
            color(context) {
              const band = codeforcesBands.find(({ min }) => min === context.tick.value)
              return band?.color || chartColors.text
            },
            stepSize: 100,
            callback(value) {
              const threshold = Number(value)
              const band = codeforcesBands.find(({ min }) => min === threshold)

              return band ? `${band.label} ${threshold}` : ''
            },
          },
        },
      },
    }
  }, [ratingHistory, theme])

  if (!handle) {
    return null
  }

  return (
    <section className="codeforces-graph-shell" aria-labelledby="codeforces-rating-history-title">
      <div className="codeforces-graph-header">
        <div>
          <h3 id="codeforces-rating-history-title">Codeforces Rating History</h3>
          <p>{handle}</p>
        </div>
      </div>

      <div className="codeforces-graph-card">
        {loading ? (
          <div className="codeforces-graph-state">Loading rating history...</div>
        ) : error ? (
          <div className="codeforces-graph-state error-text">
            <div>
              <p>{error}</p>
              <button type="button" className="codeforces-graph-retry" onClick={() => setReloadKey((value) => value + 1)}>
                Try again
              </button>
            </div>
          </div>
        ) : ratingHistory.length === 0 ? (
          <div className="codeforces-graph-state">No rated contests found for this handle.</div>
        ) : (
          <div className="codeforces-graph-canvas-wrap">
            <Line data={chartData} options={chartOptions} plugins={[codeforcesBandsPlugin]} />
          </div>
        )}
      </div>
    </section>
  )
}

export default CodeforcesGraph
