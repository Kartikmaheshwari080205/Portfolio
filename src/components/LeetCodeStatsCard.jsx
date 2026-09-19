function LeetCodeStatsCard({ handle }) {
  if (!handle) {
    return null
  }

  const statsUrl = `https://leetcard.jacoblin.cool/${encodeURIComponent(handle)}?theme=light&font=Source%20Serif%20Pro`

  return (
    <section className="leetcode-stats-shell" aria-labelledby="leetcode-stats-title">
      <div className="leetcode-stats-header">
        <div>
          <h3 id="leetcode-stats-title">LeetCode Stats</h3>
          <p>{handle}</p>
        </div>
      </div>

      <div className="leetcode-stats-card">
        <img
          src={statsUrl}
          alt={`${handle} LeetCode statistics`}
          className="leetcode-stats-image"
        />
      </div>
    </section>
  )
}

export default LeetCodeStatsCard