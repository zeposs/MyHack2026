import { useState, useEffect } from 'react'
import { ALI_PROFILE, AI_VERDICT, MENTORS, AI_REVIEW_STEPS, MENTOR_MATCH_STEPS } from '../data/mockData'

function ThinkingOverlay({ steps, title, onComplete }) {
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const stepMs = 2800 / steps.length
    let count = 0
    const interval = setInterval(() => {
      count += 1
      setCompletedCount(count)
      if (count >= steps.length) {
        clearInterval(interval)
        setTimeout(onComplete, 400)
      }
    }, stepMs)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = Math.min((completedCount / steps.length) * 100, 100)

  return (
    <div className="thinking-card">
      <div className="thinking-header">
        <div className="ai-pulse" />
        <h3>{title}</h3>
      </div>
      <div className="thinking-steps">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`thinking-step ${i < completedCount ? 'done' : i === completedCount ? 'active' : ''}`}
          >
            <span className="step-icon">{i < completedCount ? '✓' : '○'}</span>
            <span className="step-text">{step}</span>
          </div>
        ))}
      </div>
      <div className="thinking-progress">
        <div className="thinking-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function MentorCard({ mentor, expanded, onToggle, onSelect }) {
  return (
    <div className={`mentor-card ${expanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="mentor-card-header">
        <div className="mentor-avatar">{mentor.initials}</div>
        <div className="mentor-info" style={{ flex: 1 }}>
          <div className="mentor-name">{mentor.name}</div>
          <div className="mentor-tags">
            {mentor.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
        <div className="mentor-score-badge">
          <span className="score-number">{mentor.score}%</span>
          <span className="score-label">match</span>
        </div>
      </div>
      <p className="mentor-reason">{mentor.reason}</p>
      {expanded && (
        <div className="mentor-expanded">
          <p className="mentor-bio">{mentor.bio}</p>
          <div className="mentor-meta">
            <span>Past matches: {mentor.pastMatches}</span>
            <span>{mentor.availability}</span>
          </div>
          <button
            className="btn-primary"
            onClick={e => { e.stopPropagation(); onSelect(mentor) }}
          >
            Assign Mentor
          </button>
        </div>
      )}
    </div>
  )
}

export default function CradleView({
  scene, setScene,
  selectedMentor, setSelectedMentor,
  sessionDate, setSessionDate,
}) {
  const [expandedMentor, setExpandedMentor] = useState(null)

  // ── Scene: Review Queue ──────────────────────────────────────────
  if (scene === 'review') {
    return (
      <div className="view-container">
        <div className="view-header">
          <div>
            <h1 className="view-title">Application Review Queue</h1>
            <p className="view-subtitle">1 application pending — Programme Cycle Q2 2026</p>
          </div>
        </div>
        <div className="review-queue">
          <div className="app-review-card">
            <div className="arc-header">
              <div className="arc-applicant">
                <div className="arc-avatar">AH</div>
                <div>
                  <div className="arc-name">{ALI_PROFILE.name}</div>
                  <div className="arc-biz">{ALI_PROFILE.businessName}</div>
                </div>
              </div>
              <span className="status-badge pending">Pending Review</span>
            </div>
            <div className="arc-details">
              <div className="arc-detail"><span className="dl">Sector</span><span className="dv">{ALI_PROFILE.sector}</span></div>
              <div className="arc-detail"><span className="dl">Funding</span><span className="dv">{ALI_PROFILE.fundingRequested}</span></div>
              <div className="arc-detail"><span className="dl">Documents</span><span className="dv">{ALI_PROFILE.documents.length} files</span></div>
              <div className="arc-detail"><span className="dl">Submitted</span><span className="dv">15 May 2026</span></div>
            </div>
            <p className="arc-summary">"{ALI_PROFILE.businessIdea.slice(0, 130)}…"</p>
            <div className="arc-actions">
              <button className="btn-primary" onClick={() => setScene('ai_thinking')}>
                ◈ Run AI Review
              </button>
              <button className="btn-ghost">View Full Application</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Scene: AI Thinking (application review) ──────────────────────
  if (scene === 'ai_thinking') {
    return (
      <div className="view-container centered">
        <ThinkingOverlay
          steps={AI_REVIEW_STEPS}
          title="AI Application Review"
          onComplete={() => setScene('ai_verdict')}
        />
      </div>
    )
  }

  // ── Scene: AI Verdict ────────────────────────────────────────────
  if (scene === 'ai_verdict') {
    return (
      <div className="view-container">
        <div className="view-header">
          <div>
            <h1 className="view-title">AI Review Complete</h1>
            <p className="view-subtitle">{ALI_PROFILE.name} — {ALI_PROFILE.businessName}</p>
          </div>
          <span className="ai-powered-badge">◈ AI Powered</span>
        </div>
        <div className="verdict-layout">
          <div className="verdict-card approve">
            <div className="verdict-header">
              <div className="verdict-icon approve">✓</div>
              <div>
                <div className="verdict-label">AI Recommendation</div>
                <div className="verdict-decision">{AI_VERDICT.recommendation}</div>
              </div>
              <div className="confidence-ring">
                <span className="confidence-num">{AI_VERDICT.confidence}%</span>
                <span className="confidence-label">confidence</span>
              </div>
            </div>
            <div className="verdict-reasons">
              <div className="reasons-title">Supporting Evidence</div>
              {AI_VERDICT.reasons.map((r, i) => (
                <div key={i} className="reason-item">
                  <span className="reason-num">0{i + 1}</span>
                  <span className="reason-text">{r}</span>
                </div>
              ))}
            </div>
            <div className="verdict-actions">
              <button className="btn-primary approve" onClick={() => setScene('mentor_thinking')}>
                ✓ Approve &amp; Find Mentors
              </button>
              <button className="btn-danger" onClick={() => setScene('review')}>
                ✕ Deny Application
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Scene: Mentor Matching Thinking ─────────────────────────────
  if (scene === 'mentor_thinking') {
    return (
      <div className="view-container centered">
        <ThinkingOverlay
          steps={MENTOR_MATCH_STEPS}
          title="AI Mentor Matching"
          onComplete={() => setScene('mentor_shortlist')}
        />
      </div>
    )
  }

  // ── Scene: Mentor Shortlist ──────────────────────────────────────
  if (scene === 'mentor_shortlist') {
    return (
      <div className="view-container">
        <div className="view-header">
          <div>
            <h1 className="view-title">Top Mentor Matches</h1>
            <p className="view-subtitle">
              Ranked from 50 profiles — {ALI_PROFILE.name} · {ALI_PROFILE.sector}
            </p>
          </div>
          <span className="ai-powered-badge">◈ AI Powered</span>
        </div>
        <div className="mentor-list">
          {MENTORS.map((mentor, i) => (
            <div
              key={mentor.id}
              className="mentor-entry"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="rank-label">#{i + 1}</span>
              <MentorCard
                mentor={mentor}
                expanded={expandedMentor === mentor.id}
                onToggle={() => setExpandedMentor(expandedMentor === mentor.id ? null : mentor.id)}
                onSelect={m => { setSelectedMentor(m); setScene('session_booking') }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Scene: Session Booking ───────────────────────────────────────
  if (scene === 'session_booking') {
    return (
      <div className="view-container centered">
        <div className="modal-card">
          <h2>Book First Session</h2>
          <div className="booking-mentor">
            <div className="mentor-avatar sm">{selectedMentor?.initials}</div>
            <div>
              <div className="booking-mentor-name">{selectedMentor?.name}</div>
              <div className="booking-mentor-tags">
                {selectedMentor?.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
          <div className="booking-form">
            <label>Session Date</label>
            <input
              type="date"
              value={sessionDate}
              min="2026-05-17"
              onChange={e => setSessionDate(e.target.value)}
            />
            <label>Session Format</label>
            <select defaultValue="video">
              <option value="video">Video Call (Microsoft Teams)</option>
              <option value="inperson">In-Person (Cradle HQ, Cyberjaya)</option>
            </select>
            <label>Duration</label>
            <select defaultValue="60">
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn-primary large" onClick={() => setScene('session_confirmed')}>
              Confirm Session
            </button>
            <button className="btn-ghost" onClick={() => setScene('mentor_shortlist')}>
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Scene: Session Confirmed ─────────────────────────────────────
  if (scene === 'session_confirmed') {
    return (
      <div className="view-container centered">
        <div className="success-card">
          <div className="success-icon large">✓</div>
          <h2>Session Confirmed</h2>
          <p>The first mentoring session has been scheduled successfully.</p>
          <div className="session-summary">
            <div className="ss-row">
              <span className="ss-label">Participant</span>
              <span className="ss-value">{ALI_PROFILE.name}</span>
            </div>
            <div className="ss-row">
              <span className="ss-label">Business</span>
              <span className="ss-value">{ALI_PROFILE.businessName}</span>
            </div>
            <div className="ss-row">
              <span className="ss-label">Mentor Assigned</span>
              <span className="ss-value">{selectedMentor?.name}</span>
            </div>
            <div className="ss-row">
              <span className="ss-label">Session Date</span>
              <span className="ss-value">{sessionDate}</span>
            </div>
            <div className="ss-row">
              <span className="ss-label">AI Match Score</span>
              <span className="ss-value accent">{selectedMentor?.score}%</span>
            </div>
          </div>
          <button className="btn-ghost" onClick={() => setScene('review')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return null
}
