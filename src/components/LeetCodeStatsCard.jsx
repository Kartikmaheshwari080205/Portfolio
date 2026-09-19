function LeetCodeStatsCard({ handle }) {
  if (!handle) {
    return null
  }

  const cardUrl = `https://leetcard.jacoblin.cool/${encodeURIComponent(handle)}`
  const contestParams = new URLSearchParams({
    theme: 'light',
    font: 'Source Serif Pro',
    ext: 'contest',
  })
  const contestUrl = `${cardUrl}?${contestParams}`

  return (
    <section className="leetcode-stats-shell" aria-labelledby="leetcode-stats-title">
      <div className="leetcode-stats-header">
        <div>
          <h3 id="leetcode-stats-title">LeetCode Stats &amp; Contest Rating</h3>
          <p>{handle}</p>
        </div>
      </div>

      <div className="leetcode-stats-card">
        <img
          src={contestUrl}
          alt={`${handle} LeetCode contest rating history`}
          className="leetcode-stats-image"
        />
      </div>
    </section>
  )
}

export default LeetCodeStatsCard