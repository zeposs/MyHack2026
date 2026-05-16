import { useState } from 'react'
import ParticipantView from './components/ParticipantView'
import CradleView from './components/CradleView'
import EcosystemGraph from './components/EcosystemGraph'
import MonitoringView from './components/MonitoringView'

const TABS = [
  { id: 'participant', label: 'Participant' },
  { id: 'cradle',     label: 'Cradle Admin' },
  { id: 'ecosystem',  label: 'Ecosystem' },
  { id: 'monitoring', label: 'Monitoring' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('participant')

  // Scene state per view — kept alive when switching tabs
  const [participantScene, setParticipantScene] = useState('form')
  const [cradleScene,      setCradleScene]      = useState('review')
  const [selectedMentor,   setSelectedMentor]   = useState(null)
  const [sessionDate,      setSessionDate]      = useState('2026-05-28')

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">StarsConnector</span>
          <span className="brand-badge">Cradle Edition</span>
        </div>

        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="header-meta">
          <span className="live-badge">● LIVE DEMO</span>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'participant' && (
          <ParticipantView
            scene={participantScene}
            onSubmit={() => setParticipantScene('submitted')}
            onReset={() => setParticipantScene('form')}
          />
        )}
        {activeTab === 'cradle' && (
          <CradleView
            scene={cradleScene}
            setScene={setCradleScene}
            selectedMentor={selectedMentor}
            setSelectedMentor={setSelectedMentor}
            sessionDate={sessionDate}
            setSessionDate={setSessionDate}
          />
        )}
        {activeTab === 'ecosystem' && <EcosystemGraph />}
        {activeTab === 'monitoring' && <MonitoringView />}
      </main>
    </div>
  )
}
