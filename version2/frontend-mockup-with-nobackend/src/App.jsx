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
  LogOut,
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
  mentors as mockMentors,
  milestones as mockMilestones,
  monitoringProject as mockMonitoring,
  pnlData as mockPnlData,
} from './data/mockData';
import EcosystemGraph from './components/EcosystemGraph';
import LoginPage from './LoginPage';
import {
  adaptHealth,
  adaptMatches,
  adaptMilestones,
  apiGet,
  apiPatch,
  apiPost,
  clearToken,
  getToken,
  timeToISO,
} from './api';
import { DEMO_APP_ID, DEMO_STARTUP_ID } from './config';

const tabs = [
  { id: 'participant', label: 'Participant', icon: UserRound },
  { id: 'cradle',      label: 'Cradle Admin', icon: ShieldCheck },
  { id: 'ecosystem',   label: 'Ecosystem',    icon: Network },
  { id: 'monitoring',  label: 'Monitoring',   icon: BarChart3 },
];

const aiSteps = [
  'Analysing applicant profile',
  'Cross-checking funding guardrails',
  'Scanning mentor profiles',
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
  // ── Auth ────────────────────────────────────────────────────
  const [user, setUser] = useState(null);

  // ── UI flow state ───────────────────────────────────────────
  const [activeTab, setActiveTab]           = useState('participant');
  const [applicationStatus, setApplicationStatus] = useState('draft');
  const [aiStage, setAiStage]               = useState('idle');
  const [mentorFlow, setMentorFlow]         = useState('shortlist_hidden');
  const [expandedMentorId, setExpandedMentorId] = useState(mockMentors[0]?.id);
  const [selectedMentor, setSelectedMentor] = useState(mockMentors[0]);
  const [assignedMentorId, setAssignedMentorId] = useState(null);
  const [bookingOpen, setBookingOpen]       = useState(false);
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({ date: '2026-05-21', time: '10:30 AM' });
  const reviewTimer = useRef(null);

  // ── Live API data (null = fall back to mock) ─────────────────
  const [stats, setStats]                   = useState(null);
  const [apiMentors, setApiMentors]         = useState(null);
  const [liveMonitoring, setLiveMonitoring] = useState(null);
  const [liveMilestones, setLiveMilestones] = useState(null);
  const [liveFinancials, setLiveFinancials] = useState(null);
  const [monitoringReady, setMonitoringReady] = useState(false);

  // ── Restore session on mount ─────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiGet('/auth/me')
      .then((u) => {
        setUser(u);
        fetchInitialData();
      })
      .catch(() => clearToken());
  }, []);

  // Cleanup AI review timer
  useEffect(() => {
    return () => { if (reviewTimer.current) window.clearTimeout(reviewTimer.current); };
  }, []);

  // ── Data helpers ─────────────────────────────────────────────
  async function fetchInitialData() {
    apiGet('/dashboard/stats').then(setStats).catch(() => {});

    Promise.all([
      apiGet(`/startups/${DEMO_STARTUP_ID}/health`)
        .then((h) => setLiveMonitoring(adaptHealth(h)))
        .catch(() => {}),
      apiGet(`/startups/${DEMO_STARTUP_ID}/milestones`)
        .then((ms) => setLiveMilestones(adaptMilestones(ms)))
        .catch(() => {}),
      apiGet(`/startups/${DEMO_STARTUP_ID}/financials`)
        .then(setLiveFinancials)
        .catch(() => {}),
    ]).finally(() => setMonitoringReady(true));
  }

  async function fetchMatches() {
    const [matches, mentorList] = await Promise.all([
      apiGet(`/applications/${DEMO_APP_ID}/matches`),
      apiGet('/mentors'),
    ]);
    const mentorMap = Object.fromEntries(mentorList.map((m) => [m.id, m]));
    return adaptMatches(matches, mentorMap);
  }

  // ── Auth handlers ────────────────────────────────────────────
  function handleLogin(u) {
    setUser(u);
    fetchInitialData();
  }

  function handleLogout() {
    clearToken();
    setUser(null);
    setApplicationStatus('draft');
    setAiStage('idle');
    setApiMentors(null);
  }

  // ── App flow handlers ────────────────────────────────────────
  function submitApplication() {
    setApplicationStatus('submitted');
    setSessionConfirmed(false);
  }

  async function startAiReview() {
    if (reviewTimer.current) window.clearTimeout(reviewTimer.current);

    setActiveTab('cradle');
    setApplicationStatus('pending_review');
    setAiStage('thinking');
    setMentorFlow('shortlist_hidden');
    setSessionConfirmed(false);

    try {
      await apiPost(`/applications/${DEMO_APP_ID}/generate-matches`);
      const adapted = await fetchMatches();
      setApiMentors(adapted);
    } catch {
      // Gemini unavailable or API error — use mock mentors
    }

    setAiStage('verdict_ready');
    setApplicationStatus('ai_reviewed');
  }

  function approveApplication() {
    const activeMentors = apiMentors ?? mockMentors;
    setApplicationStatus('approved');
    setMentorFlow('shortlist_visible');
    setSelectedMentor(activeMentors[0]);
    setAssignedMentorId(null);
    setExpandedMentorId(activeMentors[0]?.id);
    apiPatch(`/applications/${DEMO_APP_ID}/status`, { status: 'approved' }).catch(() => {});
  }

  function openBooking(mentor) {
    setSelectedMentor(mentor);
    setBookingOpen(true);
  }

  async function confirmBooking(details) {
    setSessionDetails(details);
    setBookingOpen(false);
    setMentorFlow('confirmed');
    setAssignedMentorId(selectedMentor?.id ?? null);
    setSessionConfirmed(true);

    if (selectedMentor?.id) {
      const scheduledAt = `${details.date}T${timeToISO(details.time)}:00`;
      apiPost(`/applications/${DEMO_APP_ID}/matches/select`, {
        mentor_profile_id: selectedMentor.id,
      }).catch((e) => console.error('select mentor:', e));
      apiPost(`/applications/${DEMO_APP_ID}/sessions`, {
        mentor_profile_id: selectedMentor.id,
        scheduled_at: scheduledAt,
        notes: `Demo session booked: ${details.date} at ${details.time}`,
      }).catch((e) => console.error('book session:', e));
    }
  }

  const statusLabel = useMemo(() => {
    if (applicationStatus === 'draft')          return 'Draft';
    if (applicationStatus === 'submitted')      return 'Pending Review';
    if (applicationStatus === 'pending_review') return 'AI Review Running';
    if (applicationStatus === 'ai_reviewed')    return 'AI Reviewed';
    return 'Approved';
  }, [applicationStatus]);

  // ── Derived live data (fall back to mock when API not loaded) ─
  const activeMentors     = apiMentors ?? mockMentors;
  const activeMonitoring  = liveMonitoring ?? mockMonitoring;
  const activeMilestones  = liveMilestones ?? mockMilestones;
  const activeFinancials  = liveFinancials ?? mockPnlData;

  // ── Gate: show login if not authenticated ────────────────────
  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">SC</div>
          <div>
            <p className="eyebrow">Cradle ecosystem command centre</p>
            <h1>StartConnector</h1>
          </div>
        </div>

        <div className="top-metrics" aria-label="Live metrics">
          <MetricPill label="Applications" value={stats?.total_applications ?? 31} icon={ClipboardCheck} />
          <MetricPill label="Mentors"      value={stats?.total_mentors ?? 50}       icon={UsersRound} />
          <MetricPill label="Active Projects" value={stats?.active_programmes ?? 20} icon={Activity} />
        </div>

        <button
          className="ghost-button"
          onClick={handleLogout}
          type="button"
          title={`Signed in as ${user.name}`}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: '0.78rem' }}>{user.name}</span>
        </button>
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
            mentors={activeMentors}
            onApprove={approveApplication}
            onExpandMentor={setExpandedMentorId}
            onOpenBooking={openBooking}
            onOpenParticipant={() => setActiveTab('participant')}
            onStartReview={startAiReview}
            selectedMentor={selectedMentor}
          />
        )}

        {activeTab === 'ecosystem' && <EcosystemGraph />}

        {activeTab === 'monitoring' && (
          <MonitoringView
            loading={!monitoringReady}
            milestones={activeMilestones}
            pnlData={activeFinancials}
            project={activeMonitoring}
          />
        )}
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

// ── Sub-components ────────────────────────────────────────────

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
          <div className="avatar-xl" aria-hidden="true">AR</div>
        </div>
        <div className="field-grid">
          <InfoField label="Founder"          value={applicant.role} />
          <InfoField label="Programme"        value={applicant.programme} />
          <InfoField label="Sector"           value={applicant.sector} />
          <InfoField label="Stage"            value={applicant.stage} />
          <InfoField label="Funding request"  value={applicant.requestedFunding} />
          <InfoField label="Location"         value={applicant.location} />
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
  mentors,
  onApprove,
  onExpandMentor,
  onOpenBooking,
  onOpenParticipant,
  onStartReview,
}) {
  const hasSubmission = applicationStatus !== 'draft';
  const verdictReady  = aiStage === 'verdict_ready' || applicationStatus === 'approved';
  const approved      = applicationStatus === 'approved';
  const showMentors   = mentorFlow === 'shortlist_visible' || mentorFlow === 'confirmed';

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
                  ? 'AI Review Running…'
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
          mentors={mentors}
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
  mentors,
  onExpandMentor,
  onOpenBooking,
}) {
  return (
    <article className="panel mentor-panel reveal-up">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI mentor matching</p>
          <h3>Top {mentors.length} out of 50 scanned profiles</h3>
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
                {(mentor.tags ?? []).map((tag) => (
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
                  <p>{mentor.bio || mentor.reason}</p>
                  <div className="detail-strip">
                    <span>{mentor.stat}</span>
                    {mentor.pastMatches?.length > 0 && (
                      <span>{mentor.pastMatches.join(', ')}</span>
                    )}
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
              <span><Check size={14} /></span>
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
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
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
          Book the first mentor session. The session is saved to the backend and confirmed in the UI.
        </p>
        <div className="booking-grid">
          <label>
            <span>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            <span>Time</span>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option>10:30 AM</option>
              <option>2:00 PM</option>
              <option>4:30 PM</option>
            </select>
          </label>
        </div>
        <div className="session-summary">
          <Handshake size={18} />
          <span>Ali Rahman + {mentor.name}, {date} at {time}</span>
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

function MonitoringView({ loading, milestones, pnlData, project }) {
  if (loading) {
    return (
      <section className="scene-grid">
        <div className="loading-state">
          <BrainCircuit className="spin" size={32} />
          <p>Loading monitoring data…</p>
        </div>
      </section>
    );
  }
  return (
    <section className="scene-grid monitoring-grid">
      <div className="scene-intro">
        <div>
          <p className="eyebrow">Project monitoring</p>
          <h2>{project.name} health view</h2>
        </div>
        <StatusBadge status="on-track">{project.status}</StatusBadge>
      </div>

      <article className="panel project-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Active project</p>
            <h3>{project.name}</h3>
          </div>
          <Activity className="panel-icon" size={22} />
        </div>
        <div className="monitoring-stats">
          <InfoField label="Founder"          value={project.owner} />
          <InfoField label="Assigned mentor"  value={project.mentor} />
          <InfoField label="Runway"           value={project.runway} />
          <InfoField label="Burn"             value={project.burn} />
          <InfoField label="Next review"      value={project.nextReview} />
        </div>
      </article>

      <article className="panel milestone-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Milestone tracker</p>
            <h3>Progress overview</h3>
          </div>
          <Target className="panel-icon" size={22} />
        </div>
        <div className="milestone-track">
          {milestones.map((milestone, index) => {
            const current     = index === project.currentMilestone;
            const complete    = index < project.currentMilestone;
            const nextComplete = index + 1 <= project.currentMilestone;
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
              <Bar dataKey="revenue" name="Revenue"    fill="#2ee7d1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit"  name="Net profit" fill="#ffbf47" radius={[6, 6, 0, 0]} />
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
          {project.highlights.map((highlight, index) => (
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
  if (!active || !payload?.length) return null;
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
