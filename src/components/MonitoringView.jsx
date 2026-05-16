import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { MILESTONES, PNL_DATA, ALI_PROFILE } from '../data/mockData'

const fmtRM = v => `RM ${(v / 1000).toFixed(0)}k`

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="ct-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: 13, marginTop: 4 }}>
          {p.name}: {fmtRM(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function MonitoringView() {
  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1 className="view-title">Project Monitoring</h1>
          <p className="view-subtitle">{ALI_PROFILE.businessName} — {ALI_PROFILE.name}</p>
        </div>
        <span className="status-badge on-track">On-Track</span>
      </div>

      {/* Milestone Tracker */}
      <div className="monitoring-card">
        <div className="section-title">Milestone Progress</div>
        <div className="milestone-track">
          {MILESTONES.map((m, i) => (
            <div key={m.id} className="milestone-item">
              {i < MILESTONES.length - 1 && (
                <div className={`milestone-connector ${MILESTONES[i + 1].completed ? 'done' : ''}`} />
              )}
              <div className={`milestone-dot ${m.completed ? 'done' : ''} ${m.current ? 'current' : ''}`}>
                {m.completed ? '✓' : m.id}
              </div>
              <div className="milestone-label">
                <div className="ml-name">{m.name}</div>
                <div className="ml-date">{m.date}</div>
                {m.current && <div className="ml-current">● Current</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly P&L */}
      <div className="monitoring-card">
        <div className="chart-header">
          <div className="section-title">Quarterly P&amp;L Performance</div>
          <div className="chart-summary">
            <span className="cs-item">
              <span className="cs-label">Q4 Revenue</span>
              <span className="cs-value">RM 112k</span>
            </span>
            <span className="cs-item">
              <span className="cs-label">Q4 Net Profit</span>
              <span className="cs-value" style={{ color: '#10b981' }}>RM 31k</span>
            </span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PNL_DATA} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3350" vertical={false} />
              <XAxis
                dataKey="quarter"
                tick={{ fill: '#7a9cbf', fontSize: 12, fontFamily: 'DM Sans' }}
                axisLine={{ stroke: '#1a3350' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtRM}
                tick={{ fill: '#7a9cbf', fontSize: 12, fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
              <Legend
                wrapperStyle={{ color: '#7a9cbf', fontSize: 13, paddingTop: 16 }}
              />
              <Bar dataKey="revenue"   name="Revenue"    fill="#00d4ff" radius={[5, 5, 0, 0]} maxBarSize={56} />
              <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
