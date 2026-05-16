import { ALI_PROFILE } from '../data/mockData'

export default function ParticipantView({ scene, onSubmit, onReset }) {
  if (scene === 'submitted') {
    return (
      <div className="view-container centered">
        <div className="submitted-state">
          <div className="success-icon">✓</div>
          <h2>Application Submitted</h2>
          <p>Your application has been received by Cradle and is now pending review by a programme officer.</p>
          <div className="app-card submitted">
            <div className="app-card-header">
              <span className="applicant-name">{ALI_PROFILE.name}</span>
              <span className="status-badge pending">Pending Review</span>
            </div>
            <div className="app-meta">
              <span>{ALI_PROFILE.businessName}</span>
              <span>·</span>
              <span>{ALI_PROFILE.sector}</span>
              <span>·</span>
              <span>{ALI_PROFILE.fundingRequested}</span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onReset}>Reset Demo</button>
        </div>
      </div>
    )
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1 className="view-title">Funding Application</h1>
          <p className="view-subtitle">Cradle Entrepreneur Programme — Q2 2026 Intake</p>
        </div>
        <div className="form-status">
          <span className="status-dot green" />
          Draft — Ready to submit
        </div>
      </div>

      <div className="form-card">
        <div className="section-title">Personal Information</div>
        <div className="form-grid">
          <div className="form-field">
            <label>Full Name</label>
            <input type="text" defaultValue={ALI_PROFILE.name} readOnly />
          </div>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" defaultValue={ALI_PROFILE.email} readOnly />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input type="text" defaultValue={ALI_PROFILE.phone} readOnly />
          </div>
          <div className="form-field">
            <label>IC Number</label>
            <input type="text" defaultValue={ALI_PROFILE.ic} readOnly />
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="section-title">Business Concept</div>
        <div className="form-grid">
          <div className="form-field">
            <label>Business Name</label>
            <input type="text" defaultValue={ALI_PROFILE.businessName} readOnly />
          </div>
          <div className="form-field">
            <label>Sector</label>
            <input type="text" defaultValue={ALI_PROFILE.sector} readOnly />
          </div>
          <div className="form-field full">
            <label>Business Idea</label>
            <textarea defaultValue={ALI_PROFILE.businessIdea} readOnly rows={4} />
          </div>
          <div className="form-field">
            <label>Funding Requested</label>
            <input type="text" defaultValue={ALI_PROFILE.fundingRequested} readOnly />
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="section-title">Supporting Documents</div>
        <div className="doc-list">
          {ALI_PROFILE.documents.map((doc, i) => (
            <div key={i} className="doc-item">
              <span className="doc-icon">📄</span>
              <span className="doc-name">{doc}</span>
              <span className="doc-badge">Uploaded</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary large" onClick={onSubmit}>
          Submit Application
        </button>
      </div>
    </div>
  )
}
