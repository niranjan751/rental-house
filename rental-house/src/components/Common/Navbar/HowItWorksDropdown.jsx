import { useState } from 'react';
import './HowItWorksDropdown.css';

const STEPS = [
  { n: '01', title: 'Tell us what you need', copy: 'Set your city, budget and move-in date.', icon: '🎯' },
  { n: '02', title: 'Tour on your schedule', copy: 'Book an in-person or video walkthrough.', icon: '📅' },
  { n: '03', title: 'Sign & pay securely', copy: 'E-sign the agreement and pay through escrow.', icon: '🔐' },
  { n: '04', title: 'Move in, backed by us', copy: 'Report an issue anytime.', icon: '✨' },
];

export default function HowItWorksDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="hiw-dropdown-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a href="#how-it-works" className="hiw-trigger">
        How it works
        <svg 
          className={`hiw-chevron ${isOpen ? 'open' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </a>

      <div className={`hiw-dropdown-menu ${isOpen ? 'active' : ''}`}>
        <div className="hiw-dropdown-inner">
          <div className="hiw-dropdown-header">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>The Process</span>
            <h3>Four simple steps</h3>
            <p>From search to move-in, we make it seamless.</p>
          </div>
          <div className="hiw-dropdown-grid">
            {STEPS.map((step) => (
              <div key={step.n} className="hiw-step-card">
                <div className="hiw-step-icon">{step.icon}</div>
                <div className="hiw-step-content">
                  <div className="hiw-step-header">
                    <span className="hiw-step-num">{step.n}</span>
                    <h4>{step.title}</h4>
                  </div>
                  <p>{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
