import './HowItWorks.css';

const STEPS = [
  {
    n: '01',
    title: 'Tell us what you need',
    copy: 'Set your city, budget and move-in date. We filter out anything that doesn\u2019t genuinely match.',
  },
  {
    n: '02',
    title: 'Tour on your schedule',
    copy: 'Book an in-person or video walkthrough directly with the owner \u2014 no agent middleman.',
  },
  {
    n: '03',
    title: 'Sign & pay securely',
    copy: 'E-sign the agreement and pay your deposit through escrow. Funds release only after move-in.',
  },
  {
    n: '04',
    title: 'Move in, backed by us',
    copy: 'Report an issue anytime \u2014 our support team mediates with the owner within 48 hours.',
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="container">
        <span className="eyebrow">The process</span>
        <h2 className="how__title">From search to move-in, in four steps</h2>

        <div className="how__list">
          {STEPS.map((s) => (
            <div className="how__step" key={s.n}>
              <span className="how__num">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
