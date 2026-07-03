import './Footer.css';

const COLUMNS = [
  {
    title: 'Renters',
    links: ['Search homes', 'How it works', 'Renter protection', 'Help center'],
  },
  {
    title: 'Owners',
    links: ['List a property', 'Pricing', 'Tenant screening', 'Owner resources'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Rental<em>Hub</em></span>
          <p>Verified rental homes, honest pricing, zero surprises.</p>
        </div>

        {COLUMNS.map((col) => (
          <div className="footer__col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} RentalHub. All rights reserved.</span>
        <div className="footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
