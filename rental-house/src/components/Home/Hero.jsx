import { useState } from 'react';
import './Hero.css';

export default function Hero() {
  const [city, setCity] = useState('');

  return (
    <section className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__corner hero__corner--tl" aria-hidden="true" />
        <div className="hero__corner hero__corner--br" aria-hidden="true" />

        <span className="eyebrow">4,280 verified homes, updated today</span>

        <h1 className="hero__title">
          Find a home that's<br />
          <em>actually</em> ready to move into.
        </h1>

        <p className="hero__subtitle">
          Every listing on RentalHub is inspected, photographed and priced by
          our team &mdash; not scraped, not guessed. No surprise fees at move-in.
        </p>

        <form className="hero__search" onSubmit={(e) => e.preventDefault()}>
          <div className="hero__field hero__field--city">
            <label htmlFor="city">City or neighborhood</label>
            <input
              id="city"
              type="text"
              placeholder="Try 'Koramangala, Bengaluru'"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="hero__field">
            <label htmlFor="move-in">Move-in</label>
            <input id="move-in" type="date" />
          </div>
          <div className="hero__field hero__field--budget">
            <label htmlFor="budget">Budget / month</label>
            <select id="budget" defaultValue="">
              <option value="" disabled>Any budget</option>
              <option value="15000">Under ₹15,000</option>
              <option value="30000">Under ₹30,000</option>
              <option value="60000">Under ₹60,000</option>
              <option value="100000">Under ₹1,00,000</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary hero__submit">
            Search homes
          </button>
        </form>

        <div className="hero__trust">
          <span><strong>12,900+</strong> renters housed</span>
          <span className="hero__dot" />
          <span><strong>96%</strong> renew their lease</span>
          <span className="hero__dot" />
          <span><strong>18</strong> cities</span>
        </div>
      </div>
    </section>
  );
}
