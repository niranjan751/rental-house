import './OwnerCTA.css';

export default function OwnerCTA() {
  return (
    <section className="owner-cta" id="list">
      <div className="container owner-cta__inner">
        <div>
          <span className="eyebrow">For property owners</span>
          <h2>List your property in under 10 minutes</h2>
          <p>
            No listing fees until you find a tenant. We handle verification,
            tenant screening and the paperwork &mdash; you set the price.
          </p>
        </div>
        <a href="#owner-signup" className="btn btn-primary owner-cta__btn">
          Start listing &rarr;
        </a>
      </div>
    </section>
  );
}
