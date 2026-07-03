import './FeaturedListings.css';

const LISTINGS = [
  {
    id: 1,
    title: '2BHK near Indiranagar Metro',
    city: 'Bengaluru',
    price: '28,500',
    beds: 2,
    baths: 2,
    area: '980 sq ft',
    tag: 'Verified',
    hue: '#E8A33D',
  },
  {
    id: 2,
    title: 'Sunlit studio, Bandra West',
    city: 'Mumbai',
    price: '42,000',
    beds: 1,
    baths: 1,
    area: '520 sq ft',
    tag: 'New listing',
    hue: '#A5432B',
  },
  {
    id: 3,
    title: 'Independent villa, ECR',
    city: 'Chennai',
    price: '55,000',
    beds: 3,
    baths: 3,
    area: '1,850 sq ft',
    tag: 'Verified',
    hue: '#3E6B4F',
  },
];

function ListingCard({ listing }) {
  return (
    <article className="listing-card">
      <div className="listing-card__media" style={{ '--hue': listing.hue }}>
        <svg viewBox="0 0 200 130" className="listing-card__art" aria-hidden="true">
          <rect x="0" y="0" width="200" height="130" fill="currentColor" opacity="0.08" />
          <path d="M20 90 L60 55 L100 90 Z" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
          <rect x="30" y="90" width="60" height="26" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
          <rect x="110" y="60" width="70" height="56" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
          <line x1="0" y1="116" x2="200" y2="116" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
        <span className="listing-card__stamp">
          ₹{listing.price}
          <small>/mo</small>
        </span>
      </div>

      <div className="listing-card__body">
        <div className="listing-card__row">
          <span className="listing-card__tag">{listing.tag}</span>
          <span className="listing-card__city">{listing.city}</span>
        </div>
        <h3>{listing.title}</h3>
        <div className="listing-card__specs">
          <span>{listing.beds} bed</span>
          <span>{listing.baths} bath</span>
          <span>{listing.area}</span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedListings() {
  return (
    <section className="featured" id="search">
      <div className="container">
        <div className="featured__head">
          <div>
            <span className="eyebrow">Featured this week</span>
            <h2 className="featured__title">Homes worth a second look</h2>
          </div>
          <a href="#all-listings" className="btn btn-ghost">View all listings</a>
        </div>

        <div className="featured__grid">
          {LISTINGS.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </div>
    </section>
  );
}
