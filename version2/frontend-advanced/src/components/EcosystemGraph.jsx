import { useState, useRef } from 'react'
import { ECOSYSTEM_MENTORS, ECOSYSTEM_PARTICIPANTS } from '../data/mockData'

const STATUS_COLOR = {
  'On-Track':        '#10b981',
  'Needs Attention': '#f59e0b',
  'At Risk':         '#ef4444',
}
const MENTOR_COLOR = '#00d4ff'

const W = 1000
const H = 560
const MENTOR_X = 155
const PART_X   = 845
const MENTOR_R = 33
const PART_R   = 17

// Pre-compute fixed node positions (data is hardcoded, layout is deterministic)
const mentorNodes = ECOSYSTEM_MENTORS.map((m, i) => ({
  ...m,
  type: 'mentor',
  x: MENTOR_X,
  y: 60 + i * 110,
  r: MENTOR_R,
}))

const participantNodes = ECOSYSTEM_PARTICIPANTS.map((p, i) => ({
  ...p,
  type: 'participant',
  x: PART_X,
  y: 16 + i * 27,
  r: PART_R,
}))

const mentorById = Object.fromEntries(mentorNodes.map(m => [m.id, m]))

const links = participantNodes
  .map(p => ({ from: mentorById[p.mentorId], to: p, status: p.status }))
  .filter(l => l.from)

export default function EcosystemGraph() {
  const [hovered, setHovered] = useState(null)     // node id
  const [tooltip, setTooltip] = useState(null)      // { node, x, y } in px
  const containerRef = useRef(null)

  const handleMouseMove = e => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setTooltip(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev)
  }

  const handleEnter = (node, e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setHovered(node.id)
    setTooltip({ node, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleLeave = () => {
    setHovered(null)
    setTooltip(null)
  }

  const isHighlighted = id => !hovered || hovered === id
  const linkActive = l => hovered === l.from.id || hovered === l.to.id

  return (
    <div className="graph-wrapper">
      <div className="graph-header">
        <div>
          <h1 className="view-title">Ecosystem Relationship Graph</h1>
          <p className="view-subtitle">5 mentors · 20 participants · Q2 2026</p>
        </div>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: MENTOR_COLOR }} />Mentor
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#10b981' }} />On-Track
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#f59e0b' }} />Needs Attention
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#ef4444' }} />At Risk
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="graph-canvas-wrap"
        style={{ position: 'relative' }}
        onMouseMove={handleMouseMove}
      >
        <span className="graph-col-label left">MENTORS</span>
        <span className="graph-col-label right">PARTICIPANTS</span>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="ecosystem-svg"
          style={{ display: 'block' }}
        >
          {/* Connection lines */}
          {links.map((l, i) => {
            const active = linkActive(l)
            return (
              <line
                key={i}
                x1={l.from.x + l.from.r}
                y1={l.from.y}
                x2={l.to.x - l.to.r}
                y2={l.to.y}
                stroke={active ? STATUS_COLOR[l.status] : '#1a3350'}
                strokeWidth={active ? 1.5 : 0.7}
                opacity={hovered ? (active ? 0.85 : 0.15) : 0.45}
                style={{ transition: 'all 0.25s' }}
              />
            )
          })}

          {/* Mentor nodes */}
          {mentorNodes.map(node => {
            const lit = isHighlighted(node.id)
            return (
              <g
                key={node.id}
                onMouseEnter={e => handleEnter(node, e)}
                onMouseLeave={handleLeave}
                style={{ cursor: 'pointer', opacity: lit ? 1 : 0.3, transition: 'opacity 0.25s' }}
              >
                {hovered === node.id && (
                  <circle cx={node.x} cy={node.y} r={node.r + 10} fill="none"
                    stroke={MENTOR_COLOR} strokeWidth={0.6} opacity={0.35} />
                )}
                <circle
                  cx={node.x} cy={node.y} r={node.r}
                  fill={hovered === node.id ? 'rgba(0,212,255,0.18)' : '#0c1a30'}
                  stroke={MENTOR_COLOR}
                  strokeWidth={hovered === node.id ? 2.2 : 1.4}
                  style={{ filter: hovered === node.id ? 'drop-shadow(0 0 8px #00d4ff)' : 'none', transition: 'all 0.25s' }}
                />
                <text x={node.x} y={node.y - 4} textAnchor="middle" fill={MENTOR_COLOR}
                  fontSize="9.5" fontWeight="600" fontFamily="DM Sans, sans-serif">
                  {node.name.split(' ')[0]}
                </text>
                <text x={node.x} y={node.y + 8} textAnchor="middle" fill={MENTOR_COLOR}
                  fontSize="8" fontWeight="400" fontFamily="DM Sans, sans-serif" opacity={0.7}>
                  {node.sector}
                </text>
              </g>
            )
          })}

          {/* Participant nodes */}
          {participantNodes.map(node => {
            const color = STATUS_COLOR[node.status]
            const lit = isHighlighted(node.id)
            return (
              <g
                key={node.id}
                onMouseEnter={e => handleEnter(node, e)}
                onMouseLeave={handleLeave}
                style={{ cursor: 'pointer', opacity: lit ? 1 : 0.25, transition: 'opacity 0.25s' }}
              >
                <circle
                  cx={node.x} cy={node.y} r={node.r}
                  fill={hovered === node.id ? `${color}22` : '#0c1a30'}
                  stroke={color}
                  strokeWidth={hovered === node.id ? 2 : 1}
                  style={{ filter: hovered === node.id ? `drop-shadow(0 0 6px ${color})` : 'none', transition: 'all 0.25s' }}
                />
                <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em"
                  fill={color} fontSize="7" fontWeight="600" fontFamily="DM Sans, sans-serif">
                  {node.name.split(' ')[0]}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="graph-tooltip"
            style={{
              left: tooltip.x + (tooltip.node.type === 'mentor' ? 44 : 16),
              top: tooltip.y,
              transform: 'translateY(-50%)',
            }}
          >
            {tooltip.node.type === 'mentor' ? (
              <>
                <div className="tt-name">{tooltip.node.name}</div>
                <div className="tt-row"><span>Sector</span><span>{tooltip.node.sector}</span></div>
                <div className="tt-row"><span>Active matches</span><span>{tooltip.node.matches}</span></div>
              </>
            ) : (
              <>
                <div className="tt-name">{tooltip.node.project}</div>
                <div className="tt-sub">{tooltip.node.name}</div>
                <div className="tt-row"><span>Sector</span><span>{tooltip.node.sector}</span></div>
                <div className="tt-row">
                  <span>Status</span>
                  <span style={{ color: STATUS_COLOR[tooltip.node.status] }}>{tooltip.node.status}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
