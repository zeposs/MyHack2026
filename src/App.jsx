import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  Gauge,
  Handshake,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  aiVerdict,
  applicant,
  mentors,
  milestones,
  monitoringProject,
  pnlData,
} from './data/mockData';
import EcosystemGraph from './components/EcosystemGraph';

const tabs = [
  { id: 'participant', label: 'Participant', icon: UserRound },
  { id: 'cradle', label: 'Cradle Admin', icon: ShieldCheck },
  { id: 'ecosystem', label: 'Ecosystem', icon: Network },
  { id: 'monitoring', label: 'Monitoring', icon: BarChart3 },
];

const aiSteps = [
  'Analysing applicant profile',
  'Cross-checking funding guardrails',
  'Scanning 50 mentor profiles',
  'Scoring domain similarity',
  'Ranking by historical success rate',
];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function compactRM(value) {
  return `RM ${Math.round(value / 1000)}k`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('participant');
  const [applicationStatus, setApplicationStatus] = useState('draft');
  const [aiStage, setAiStage] = useState('idle');
  const [mentorFlow, setMentorFlow] = useState('shortlist_hidden');
  const [expandedMentorId, setExpandedMentorId] = useState('aminah');
  const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
  const [assignedMentorId, setAssignedMentorId] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({
    date: '2026-05-21',
    time: '10:30 AM',
  });
  const reviewTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (reviewTimer.current) {
        window.clearTimeout(reviewTimer.current);
      }
    };
  }, []);

  function submitApplication() {
    setApplicationStatus('submitted');
    setSessionConfirmed(false);
  }

  function startAiReview() {
    if (reviewTimer.current) {
      window.clearTimeout(reviewTimer.current);
    }

    setActiveTab('cradle');
    setApplicationStatus('pending_review');
    setAiStage('thinking');
    setMentorFlow('shortlist_hidden');
    setSessionConfirmed(false);

    reviewTimer.current = window.setTimeout(() => {
      setAiStage('verdict_ready');
      setApplicationStatus('ai_reviewed');
    }, 3000);
  }

  function approveApplication() {
    setApplicationStatus('approved');
    setMentorFlow('shortlist_visible');
    setSelectedMentor(mentors[0]);
    setAssignedMentorId(null);
    setExpandedMentorId('aminah');
  }

  function openBooking(mentor) {
    setSelectedMentor(mentor);
    setBookingOpen(true);
  }

  function confirmBooking(details) {
    setSessionDetails(details);
    setBookingOpen(false);
    setMentorFlow('confirmed');
    setAssignedMentorId(selectedMentor?.id ?? null);
    setSessionConfirmed(true);
  }

  const statusLabel = useMemo(() => {
    if (applicationStatus === 'draft') return 'Draft';
    if (applicationStatus === 'submitted') return 'Pending Review';
    if (applicationStatus === 'pending_review') return 'AI Review Running';
    if (applicationStatus === 'ai_reviewed') return 'AI Reviewed';
    return 'Approved';
  }, [applicationStatus]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">SC</div>
          <div>
            <p className="eyebrow">Cradle ecosystem command centre</p>
            <h1>StarsConnector</h1>
          </div>
        </div>

        <div className="top-metrics" aria-label="Demo metrics">
          <MetricPill label="Applications" value="31" icon={ClipboardCheck} />
          <MetricPill label="Mentors" value="50" icon={UsersRound} />
          <MetricPill label="Active Projects" value="20" icon={Activity} />
        </div>
      </header>

      <nav className="tabbar" aria-label="Demo views">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            className={cx('tab-button', activeTab === id && 'is-active')}
            key={id}
            onClick={() => setActiveTab(id)}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <main className="scene-stage">
        {activeTab === 'participant' && (
          <ParticipantView
            applicationStatus={applicationStatus}
            onSubmit={submitApplication}
            onOpenCradle={() => setActiveTab('cradle')}
            statusLabel={statusLabel}
          />
        )}

        {activeTab === 'cradle' && (
          <CradleView
            applicationStatus={applicationStatus}
            aiStage={aiStage}
            expandedMentorId={expandedMentorId}
            mentorFlow={mentorFlow}
            assignedMentorId={assignedMentorId}
            onApprove={approveApplication}
            onExpandMentor={setExpandedMentorId}
            onOpenBooking={openBooking}
            onOpenParticipant={() => setActiveTab('participant')}
            onStartReview={startAiReview}
            selectedMentor={selectedMentor}
          />
        )}

        {activeTab === 'ecosystem' && (
          <EcosystemGraph />
        )}

        {activeTab === 'monitoring' && <MonitoringView />}
      </main>

      {aiStage === 'thinking' && <AiThinkingOverlay />}

      {bookingOpen && selectedMentor && (
        <SessionBookingModal
          mentor={selectedMentor}
          onClose={() => setBookingOpen(false)}
          onConfirm={confirmBooking}
          sessionDetails={sessionDetails}
        />
      )}

      {sessionConfirmed && selectedMentor && (
        <div className="success-toast" role="status">
          <CheckCircle2 size={18} />
          <span>
            Session confirmed with {selectedMentor.name} on {sessionDetails.date} at{' '}
            {sessionDetails.time}
          </span>
          <button aria-label="Dismiss" onClick={() => setSessionConfirmed(false)} type="button">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function MetricPill({ icon: Icon, label, value }) {
  return (
    <div className="metric-pill">
      <Icon size={16} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status, children }) {
  return <span className={cx('status-badge', status)}>{children}</span>;
}

function ParticipantView({ applicationStatus, onOpenCradle, onSubmit, statusLabel }) {
  const submitted = applicationStatus !== 'draft';

  return (
    <section className="scene-grid participant-grid">
      <div className="scene-intro">
        <div>
          <p className="eyebrow">Participant application</p>
          <h2>Ali's completed funding profile</h2>
        </div>
        <StatusBadge status={submitted ? 'pending' : 'draft'}>{statusLabel}</StatusBadge>
      </div>

      <article className="panel applicant-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Applicant dossier</p>
            <h3>{applicant.name}</h3>
          </div>
          <div className="avatar-xl" aria-hidden="true">
            AR
          </div>
        </div>

        <div className="field-grid">
          <InfoField label="Founder" value={applicant.role} />
          <InfoField label="Programme" value={applicant.programme} />
          <InfoField label="Sector" value={applicant.sector} />
          <InfoField label="Stage" value={applicant.stage} />
          <InfoField label="Funding request" value={applicant.requestedFunding} />
          <InfoField label="Location" value={applicant.location} />
        </div>
      </article>

      <article className="panel application-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Business concept</p>
            <h3>SeniCare Living</h3>
          </div>
          <Target className="panel-icon" size={22} />
        </div>
        <p className="body-copy">{applicant.businessIdea}</p>
        <div className="impact-band">
          <Sparkles size={18} />
          <span>{applicant.impact}</span>
        </div>

        <div className="document-list" aria-label="Uploaded documents">
          {applicant.documents.map((document) => (
            <div className="document-row" key={document.name}>
              <FileText size={18} />
              <div>
                <strong>{document.name}</strong>
                <span>{document.meta}</span>
              </div>
              <BadgeCheck size={18} />
            </div>
          ))}
        </div>

        <div className="action-row">
          <button
            className="primary-button"
            disabled={submitted}
            onClick={onSubmit}
            type="button"
          >
            {submitted ? <CheckCircle2 size={18} /> : <Send size={18} />}
            <span>{submitted ? 'Application Submitted' : 'Submit Application'}</span>
          </button>
          {submitted && (
            <button className="secondary-button" onClick={onOpenCradle} type="button">
              <ShieldCheck size={18} />
              <span>Open Cradle Queue</span>
            </button>
          )}
        </div>
      </article>

      <article className="panel signal-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Readiness signals</p>
            <h3>Application context preserved</h3>
          </div>
          <Gauge className="panel-icon" size={22} />
        </div>
        <div className="signal-list">
          {applicant.signals.map((signal, index) => (
            <div className="signal-row" key={signal}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{signal}</p>
            </div>
          ))}
        </div>
      </article>

      <article className={cx('panel submission-panel', submitted && 'is-submitted')}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Queue handoff</p>
            <h3>{submitted ? 'Live in Cradle review queue' : 'Ready for submission'}</h3>
          </div>
          <Clock3 className="panel-icon" size={22} />
        </div>
        <p className="body-copy">
          {submitted
            ? `Submitted at ${applicant.submittedAt}. The admin dashboard now receives Ali as a pending review item.`
            : 'The presenter submits this profile first, then switches to Cradle Admin for the AI review moment.'}
        </p>
      </article>
    </section>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CradleView({
  aiStage,
  applicationStatus,
  expandedMentorId,
  assignedMentorId,
  mentorFlow,
  onApprove,
  onExpandMentor,
  onOpenBooking,
  onOpenParticipant,
  onStartReview,
}) {
  const hasSubmission = applicationStatus !== 'draft';
  const verdictReady = aiStage === 'verdict_ready' || applicationStatus === 'approved';
  const approved = applicationStatus === 'approved';
  const showMentors = mentorFlow === 'shortlist_visible' || mentorFlow === 'confirmed';

  return (
    <section className="scene-grid cradle-grid">
      <div className="scene-intro">
        <div>
          <p className="eyebrow">Cradle Admin dashboard</p>
          <h2>Review, approve, and match Ali to the right mentor</h2>
        </div>
        <StatusBadge status={approved ? 'approved' : hasSubmission ? 'pending' : 'draft'}>
          {approved ? 'Approved' : hasSubmission ? 'Pending Review' : 'Awaiting Submission'}
        </StatusBadge>
      </div>

      <article className="panel queue-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Application queue</p>
            <h3>{hasSubmission ? '1 new application' : 'No submitted applications'}</h3>
          </div>
          <ClipboardCheck className="panel-icon" size={22} />
        </div>

        {hasSubmission ? (
          <div className="queue-card">
            <div className="queue-card-main">
              <div className="avatar-md">AR</div>
              <div>
                <div className="queue-title">
                  <h4>{applicant.name}</h4>
                  <StatusBadge status={approved ? 'approved' : 'pending'}>
                    {approved ? 'Approved' : 'Pending Review'}
                  </StatusBadge>
                </div>
                <p>{applicant.businessIdea}</p>
                <div className="inline-tags">
                  <span>{applicant.sector}</span>
                  <span>{applicant.requestedFunding}</span>
                  <span>{applicant.stage}</span>
                </div>
              </div>
            </div>

            <button
              className="primary-button"
              disabled={aiStage === 'thinking' || verdictReady}
              onClick={onStartReview}
              type="button"
            >
              <BrainCircuit size={18} />
              <span>
                {aiStage === 'thinking'
                  ? 'AI Review Running'
                  : verdictReady
                    ? 'AI Review Complete'
                    : 'AI Review'}
              </span>
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <Bot size={32} />
            <p>Ali appears here immediately after the Participant tab submit action.</p>
            <button className="secondary-button" onClick={onOpenParticipant} type="button">
              <UserRound size={18} />
              <span>Open Participant Tab</span>
            </button>
          </div>
        )}
      </article>

      {verdictReady && (
        <article className="panel verdict-panel reveal-up">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">AI verdict</p>
              <h3>{aiVerdict.recommendation} recommended</h3>
            </div>
            <div className="score-ring">
              <strong>{aiVerdict.confidence}%</strong>
              <span>confidence</span>
            </div>
          </div>
          <p className="body-copy">{aiVerdict.summary}</p>

          <div className="reason-list">
            {aiVerdict.reasons.map((reason, index) => (
              <div className="reason-row" key={reason}>
                <span>{index + 1}</span>
                <p>{reason}</p>
              </div>
            ))}
          </div>

          <div className="action-row">
            <button
              className="primary-button"
              disabled={approved}
              onClick={onApprove}
              type="button"
            >
              <CheckCircle2 size={18} />
              <span>{approved ? 'Approved' : 'Approve Application'}</span>
            </button>
            <button className="ghost-button" disabled={approved} type="button">
              <X size={18} />
              <span>Deny</span>
            </button>
          </div>
        </article>
      )}

      {showMentors && (
        <MentorShortlist
          assignedMentorId={assignedMentorId}
          confirmed={mentorFlow === 'confirmed'}
          expandedMentorId={expandedMentorId}
          onExpandMentor={onExpandMentor}
          onOpenBooking={onOpenBooking}
        />
      )}
    </section>
  );
}

function MentorShortlist({
  assignedMentorId,
  confirmed,
  expandedMentorId,
  onExpandMentor,
  onOpenBooking,
}) {
  return (
    <article className="panel mentor-panel reveal-up">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI mentor matching</p>
          <h3>Top 3 out of 50 scanned profiles</h3>
        </div>
        <Handshake className="panel-icon" size={22} />
      </div>

      <div className="mentor-grid">
        {mentors.map((mentor, index) => {
          const expanded = expandedMentorId === mentor.id;
          return (
            <div
              className={cx('mentor-card', expanded && 'is-expanded')}
              key={mentor.id}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mentor-card-top">
                <div className="mentor-avatar">{mentor.initials}</div>
                <div>
                  <span className="rank-label">Rank #{index + 1}</span>
                  <h4>{mentor.name}</h4>
                  <p>{mentor.title}</p>
                </div>
                <div className="mentor-score">
                  <strong>{mentor.score}%</strong>
                  <span>match</span>
                </div>
              </div>

              <div className="inline-tags">
                {mentor.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p className="match-reason">{mentor.reason}</p>

              <button
                className="expand-button"
                onClick={() => onExpandMentor(expanded ? '' : mentor.id)}
                type="button"
              >
                <ChevronDown size={17} />
                <span>{expanded ? 'Collapse Profile' : 'Expand Profile'}</span>
              </button>

              {expanded && (
                <div className="mentor-details">
                  <p>{mentor.bio}</p>
                  <div className="detail-strip">
                    <span>{mentor.stat}</span>
                    <span>{mentor.pastMatches.join(', ')}</span>
                    <span>{mentor.availability}</span>
                  </div>
                </div>
              )}

              <button
                className={cx(
                  'primary-button',
                  confirmed && assignedMentorId === mentor.id && 'is-confirmed',
                )}
                onClick={() => onOpenBooking(mentor)}
                type="button"
              >
                {confirmed && assignedMentorId === mentor.id ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <CalendarDays size={18} />
                )}
                <span>
                  {confirmed && assignedMentorId === mentor.id
                    ? 'Session Confirmed'
                    : 'Assign Mentor'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function AiThinkingOverlay() {
  return (
    <div className="ai-overlay" role="status" aria-live="polite">
      <div className="ai-modal">
        <div className="ai-core">
          <BrainCircuit size={32} />
          <span />
        </div>
        <p className="eyebrow">AI review engine</p>
        <h3>System is thinking</h3>
        <div className="progress-shell">
          <div className="progress-fill" />
        </div>
        <div className="ai-step-list">
          {aiSteps.map((step, index) => (
            <div className="ai-step" key={step} style={{ animationDelay: `${index * 420}ms` }}>
              <span>
                <Check size={14} />
              </span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionBookingModal({ mentor, onClose, onConfirm, sessionDetails }) {
  const [date, setDate] = useState(sessionDetails.date);
  const [time, setTime] = useState(sessionDetails.time);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button className="close-button" aria-label="Close booking modal" onClick={onClose} type="button">
          <X size={18} />
        </button>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Session booking</p>
            <h3 id="booking-title">Connect Ali with {mentor.name}</h3>
          </div>
          <CalendarDays className="panel-icon" size={22} />
        </div>
        <p className="body-copy">
          The first mentor session is confirmed in-memory for the live demo. No calendar or backend
          integration is required.
        </p>
        <div className="booking-grid">
          <label>
            <span>Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            <span>Time</span>
            <select value={time} onChange={(event) => setTime(event.target.value)}>
              <option>10:30 AM</option>
              <option>2:00 PM</option>
              <option>4:30 PM</option>
            </select>
          </label>
        </div>
        <div className="session-summary">
          <Handshake size={18} />
          <span>
            Ali Rahman + {mentor.name}, {date} at {time}
          </span>
        </div>
        <div className="action-row">
          <button className="primary-button" onClick={() => onConfirm({ date, time })} type="button">
            <CheckCircle2 size={18} />
            <span>Confirm Session</span>
          </button>
          <button className="secondary-button" onClick={onClose} type="button">
            <X size={18} />
            <span>Cancel</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function MonitoringView() {
  return (
    <section className="scene-grid monitoring-grid">
      <div className="scene-intro">
        <div>
          <p className="eyebrow">Project monitoring</p>
          <h2>{monitoringProject.name} health view</h2>
        </div>
        <StatusBadge status="on-track">{monitoringProject.status}</StatusBadge>
      </div>

      <article className="panel project-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Active project</p>
            <h3>{monitoringProject.name}</h3>
          </div>
          <Activity className="panel-icon" size={22} />
        </div>
        <div className="monitoring-stats">
          <InfoField label="Founder" value={monitoringProject.owner} />
          <InfoField label="Assigned mentor" value={monitoringProject.mentor} />
          <InfoField label="Runway" value={monitoringProject.runway} />
          <InfoField label="Burn" value={monitoringProject.burn} />
          <InfoField label="Next review" value={monitoringProject.nextReview} />
        </div>
      </article>

      <article className="panel milestone-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Milestone tracker</p>
            <h3>Current position: Market Validation Done</h3>
          </div>
          <Target className="panel-icon" size={22} />
        </div>
        <div className="milestone-track">
          {milestones.map((milestone, index) => {
            const current = index === monitoringProject.currentMilestone;
            const complete = index < monitoringProject.currentMilestone;
            const nextComplete = index + 1 <= monitoringProject.currentMilestone;
            return (
              <div className="milestone-item" key={milestone.label}>
                {index < milestones.length - 1 && (
                  <div className={cx('milestone-connector', nextComplete && 'done')} />
                )}
                <div className={cx('milestone-dot', complete && 'done', current && 'current')}>
                  {complete ? <Check size={14} /> : index + 1}
                </div>
                <div className="milestone-label">
                  <div className="ml-name">{milestone.label}</div>
                  <div className="ml-date">{milestone.date}</div>
                  {current && <div className="ml-current">● Current</div>}
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="panel chart-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Quarterly P&amp;L</p>
            <h3>Revenue and net profit trajectory</h3>
          </div>
          <BarChart3 className="panel-icon" size={22} />
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={pnlData} margin={{ top: 18, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#243033" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="quarter" stroke="#8da0a4" tickLine={false} axisLine={false} />
              <YAxis
                stroke="#8da0a4"
                tickFormatter={compactRM}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip content={<PnlTooltip />} cursor={{ fill: 'rgba(46, 231, 209, 0.08)' }} />
              <Legend iconType="circle" wrapperStyle={{ color: '#cfe1e4' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#2ee7d1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Net profit" fill="#ffbf47" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel highlights-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Latest signals</p>
            <h3>Why the project remains on track</h3>
          </div>
          <CheckCircle2 className="panel-icon" size={22} />
        </div>
        <div className="signal-list">
          {monitoringProject.highlights.map((highlight, index) => (
            <div className="signal-row" key={highlight}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{highlight}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function PnlTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.dataKey} style={{ color: item.color }}>
          {item.name}: {compactRM(item.value)}
        </span>
      ))}
    </div>
  );
}
