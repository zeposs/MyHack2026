import { API_BASE } from './config';

// ── Token management ──────────────────────────────────────────
export const getToken  = () => localStorage.getItem('sc_token');
export const setToken  = (t) => localStorage.setItem('sc_token', t);
export const clearToken = () => localStorage.removeItem('sc_token');

// ── Core fetch wrapper ────────────────────────────────────────
async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    window.location.reload();
    return null;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const apiGet   = (path)        => request('GET',   path);
export const apiPost  = (path, body)  => request('POST',  path, body);
export const apiPatch = (path, body)  => request('PATCH', path, body);

// ── Auth ──────────────────────────────────────────────────────
export async function login(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  setToken(data.access_token);
  return request('GET', '/auth/me');
}

// ── Time helper ───────────────────────────────────────────────
export function timeToISO(t) {
  const [time, period] = t.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Adapters: API shape → UI shape ────────────────────────────

/**
 * Transform MatchingResultOut[] + MentorDetail map → mentor card objects the UI expects.
 * mentorMap: { [mentor_profile_id]: MentorDetail }
 */
export function adaptMatches(matches, mentorMap = {}) {
  return matches
    .slice()
    .sort((a, b) => a.rank_position - b.rank_position)
    .map((m) => {
      const profile = mentorMap[m.mentor_profile_id] ?? {};
      const name = m.mentor_name ?? profile.user_name ?? 'Mentor';
      const initials = name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      return {
        id: m.mentor_profile_id,
        name,
        title: m.mentor_title ?? profile.title ?? '',
        score: Math.round(Number(m.match_score)),
        initials,
        tags: [
          ...(profile.industries ?? []).slice(0, 2),
          ...(profile.skills ?? []).slice(0, 1),
        ],
        reason: m.reason_summary,
        bio: profile.bio ?? '',
        pastMatches: [],
        availability: m.mentor_availability ?? 'available',
        stat: `${Math.round(Number(m.match_score))}% match · ${profile.total_sessions ?? 0} sessions`,
      };
    });
}

/**
 * Transform StartupHealthOut → monitoringProject shape the UI expects.
 */
export function adaptHealth(h) {
  const STATUS_MAP = { on_track: 'On Track', at_risk: 'At Risk', delayed: 'Delayed' };
  return {
    name: h.startup_name,
    owner: h.owner ?? 'Unknown',
    status: STATUS_MAP[h.status] ?? h.status,
    mentor: h.mentor ?? 'Not yet assigned',
    currentMilestone: h.current_milestone_index,
    runway: h.runway,
    burn: h.burn,
    nextReview: h.next_review ?? 'TBD',
    highlights: h.highlights ?? [],
  };
}

/**
 * Transform MilestoneOut[] → milestone display objects.
 */
export function adaptMilestones(milestones) {
  return milestones.map((m) => ({
    label: m.title,
    date: m.target_date
      ? new Date(m.target_date).toLocaleDateString('en-MY', {
          month: 'short',
          year: 'numeric',
        })
      : '',
    status: m.status,
  }));
}

// Financials already match { quarter, revenue, profit } — no transform needed.
