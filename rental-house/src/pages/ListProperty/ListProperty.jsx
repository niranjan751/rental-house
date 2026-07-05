import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Common/Navbar/Navbar';
import Footer from '../../components/Common/Footer/Footer';
import AuthModal from '../../components/Common/AuthModal/AuthModal';
import './ListProperty.css';

const DRAFT_KEY = 'rentalhub_listing_draft';
const LISTINGS_KEY = 'rentalhub_listings';

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'house', label: 'Independent House', icon: '🏠' },
  { id: 'villa', label: 'Villa', icon: '🏡' },
  { id: 'studio', label: 'Studio', icon: '🛋️' },
  { id: 'pg', label: 'PG / Hostel', icon: '🛏️' },
];

const FURNISHING = ['Unfurnished', 'Semi-furnished', 'Fully furnished'];

const AMENITIES = [
  'Parking', 'Lift', 'Power backup', '24×7 Water', 'Security guard',
  'Gym', 'Wi-Fi ready', 'Pet friendly', 'Balcony', 'Air conditioning',
  'Modular kitchen', 'CCTV',
];

const STEPS = ['Basics', 'Location', 'Details', 'Photos', 'Pricing', 'Review'];

const emptyForm = {
  type: '',
  title: '',
  description: '',
  address: '',
  locality: '',
  city: '',
  pincode: '',
  bedrooms: 1,
  bathrooms: 1,
  area: '',
  furnishing: '',
  amenities: [],
  photos: [], // { id, name, dataUrl }
  rent: '',
  deposit: '',
  maintenance: '',
  availableFrom: '',
  negotiable: false,
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...emptyForm, ...JSON.parse(raw) } : emptyForm;
  } catch {
    return emptyForm;
  }
}

export default function ListProperty() {
  const { isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(loadDraft);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  // Autosave draft
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setSaved(true);
      const clear = setTimeout(() => setSaved(false), 1600);
      return () => clearTimeout(clear);
    }, 500);
    return () => clearTimeout(t);
  }, [form]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));

  /* ── validation per step ─────────────────────────── */
  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.type) e.type = 'Choose a property type';
      if (!form.title.trim()) e.title = 'Give your listing a title';
      if (form.description.trim().length < 30) e.description = 'Write at least 30 characters so renters know what to expect';
    }
    if (s === 1) {
      if (!form.address.trim()) e.address = 'Enter the street address';
      if (!form.city.trim()) e.city = 'Enter the city';
      if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    }
    if (s === 2) {
      if (!form.area || Number(form.area) <= 0) e.area = 'Enter the carpet area';
      if (!form.furnishing) e.furnishing = 'Select a furnishing status';
    }
    if (s === 3) {
      if (form.photos.length < 3) e.photos = 'Add at least 3 photos so your listing gets noticed';
    }
    if (s === 4) {
      if (!form.rent || Number(form.rent) <= 0) e.rent = 'Enter the monthly rent';
      if (!form.deposit || Number(form.deposit) < 0) e.deposit = 'Enter the security deposit';
      if (!form.availableFrom) e.availableFrom = 'Pick a move-in availability date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const goToStep = (i) => {
    // only allow jumping to a step you've already validated up through
    if (i <= step || STEPS.slice(0, i).every((_, idx) => validateStep(idx))) setStep(i);
  };

  /* ── photo handling ──────────────────────────────── */
  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList).slice(0, 10 - form.photos.length);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({
          ...f,
          photos: [...f.photos, { id: crypto.randomUUID(), name: file.name, dataUrl: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
  }, [form.photos.length]);

  const removePhoto = (id) =>
    setForm((f) => ({ ...f, photos: f.photos.filter((p) => p.id !== id) }));

  const onDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── publish ─────────────────────────────────────── */
  const publish = async () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (!validateStep(4)) return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    listings.push({ ...form, id: crypto.randomUUID(), ownerEmail: user?.email, createdAt: new Date().toISOString() });
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    localStorage.removeItem(DRAFT_KEY);

    setPublishing(false);
    setPublished(true);
  };

  const startNewListing = () => {
    setForm(emptyForm);
    setStep(0);
    setPublished(false);
  };

  const completion = Math.round(
    ([form.type, form.title, form.description.length > 29, form.address, form.city,
      form.pincode.length === 6, form.area, form.furnishing, form.photos.length >= 3,
      form.rent, form.deposit, form.availableFrom].filter(Boolean).length / 12) * 100
  );

  if (published) {
    return (
      <>
        <Navbar />
        <main className="list-success">
          <div className="list-success__card">
            <div className="list-success__badge">✓</div>
            <span className="eyebrow">Listing published</span>
            <h1>{form.title} is now live</h1>
            <p>Renters searching {form.city} will start seeing your listing right away. We'll email you when someone requests a tour.</p>
            <div className="list-success__actions">
              <button className="btn btn-primary" onClick={startNewListing}>List another place</button>
              <a href="/" className="btn btn-ghost">Back to home</a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="list-page">
        <div className="container list-page__head">
          <span className="eyebrow">List your place</span>
          <h1>Get your property in front of verified renters</h1>
          <p>Free to list. No commission on the first month's rent. Average time to first tour request: 3 days.</p>
        </div>

        {!isAuthenticated && (
          <div className="container">
            <div className="list-page__gate">
              <span>You can fill this out now — we'll just ask you to log in before publishing.</span>
              <button className="btn btn-ghost" onClick={() => setAuthOpen(true)}>Log in / Sign up</button>
            </div>
          </div>
        )}

        <div className="container list-page__body">
          {/* ── Stepper ── */}
          <nav className="stepper" aria-label="Listing steps">
            {STEPS.map((label, i) => (
              <button
                key={label}
                className={`stepper__item ${i === step ? 'stepper__item--active' : ''} ${i < step ? 'stepper__item--done' : ''}`}
                onClick={() => goToStep(i)}
              >
                <span className="stepper__dot">{i < step ? '✓' : i + 1}</span>
                {label}
              </button>
            ))}
            <div className="stepper__progress">
              <div className="stepper__progress-bar" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
            </div>
          </nav>

          <div className="list-page__grid">
            {/* ── Form column ── */}
            <div className="list-card">
              {saved && <span className="list-card__saved">Draft saved</span>}

              {step === 0 && (
                <section>
                  <h2>What kind of place is it?</h2>
                  <div className="chip-grid">
                    {PROPERTY_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`type-chip ${form.type === t.id ? 'type-chip--active' : ''}`}
                        onClick={() => update('type', t.id)}
                      >
                        <span className="type-chip__icon">{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {errors.type && <p className="field-error">{errors.type}</p>}

                  <div className="field">
                    <label htmlFor="title">Listing title</label>
                    <input
                      id="title" type="text" placeholder="e.g. Bright 2BHK near Metro, Indiranagar"
                      value={form.title} onChange={(e) => update('title', e.target.value)}
                      aria-invalid={!!errors.title}
                    />
                    {errors.title && <p className="field-error">{errors.title}</p>}
                  </div>

                  <div className="field">
                    <div className="field__row">
                      <label htmlFor="description">Description</label>
                      <span className="char-count">{form.description.length}/600</span>
                    </div>
                    <textarea
                      id="description" rows={5} maxLength={600}
                      placeholder="Describe the space, the neighborhood, and what makes it worth renting..."
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      aria-invalid={!!errors.description}
                    />
                    {errors.description && <p className="field-error">{errors.description}</p>}
                  </div>
                </section>
              )}

              {step === 1 && (
                <section>
                  <h2>Where is it located?</h2>
                  <div className="field">
                    <label htmlFor="address">Street address</label>
                    <input
                      id="address" type="text" placeholder="Flat / house no., street name"
                      value={form.address} onChange={(e) => update('address', e.target.value)}
                      aria-invalid={!!errors.address}
                    />
                    {errors.address && <p className="field-error">{errors.address}</p>}
                  </div>
                  <div className="field-row-2">
                    <div className="field">
                      <label htmlFor="locality">Locality / neighborhood</label>
                      <input
                        id="locality" type="text" placeholder="e.g. Koramangala"
                        value={form.locality} onChange={(e) => update('locality', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="city">City</label>
                      <input
                        id="city" type="text" placeholder="e.g. Bengaluru"
                        value={form.city} onChange={(e) => update('city', e.target.value)}
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && <p className="field-error">{errors.city}</p>}
                    </div>
                  </div>
                  <div className="field field--narrow">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      id="pincode" type="text" inputMode="numeric" maxLength={6} placeholder="560034"
                      value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, ''))}
                      aria-invalid={!!errors.pincode}
                    />
                    {errors.pincode && <p className="field-error">{errors.pincode}</p>}
                  </div>
                </section>
              )}

              {step === 2 && (
                <section>
                  <h2>Tell us about the space</h2>
                  <div className="counter-row">
                    <div className="counter">
                      <span>Bedrooms</span>
                      <div className="counter__control">
                        <button type="button" onClick={() => update('bedrooms', Math.max(0, form.bedrooms - 1))}>−</button>
                        <strong>{form.bedrooms}</strong>
                        <button type="button" onClick={() => update('bedrooms', form.bedrooms + 1)}>+</button>
                      </div>
                    </div>
                    <div className="counter">
                      <span>Bathrooms</span>
                      <div className="counter__control">
                        <button type="button" onClick={() => update('bathrooms', Math.max(1, form.bathrooms - 1))}>−</button>
                        <strong>{form.bathrooms}</strong>
                        <button type="button" onClick={() => update('bathrooms', form.bathrooms + 1)}>+</button>
                      </div>
                    </div>
                    <div className="field field--narrow">
                      <label htmlFor="area">Carpet area (sq ft)</label>
                      <input
                        id="area" type="number" placeholder="980"
                        value={form.area} onChange={(e) => update('area', e.target.value)}
                        aria-invalid={!!errors.area}
                      />
                      {errors.area && <p className="field-error">{errors.area}</p>}
                    </div>
                  </div>

                  <div className="field">
                    <label>Furnishing</label>
                    <div className="pill-row">
                      {FURNISHING.map((f) => (
                        <button
                          key={f} type="button"
                          className={`pill ${form.furnishing === f ? 'pill--active' : ''}`}
                          onClick={() => update('furnishing', f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    {errors.furnishing && <p className="field-error">{errors.furnishing}</p>}
                  </div>

                  <div className="field">
                    <label>Amenities</label>
                    <div className="pill-row pill-row--wrap">
                      {AMENITIES.map((a) => (
                        <button
                          key={a} type="button"
                          className={`pill ${form.amenities.includes(a) ? 'pill--active' : ''}`}
                          onClick={() => toggleAmenity(a)}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section>
                  <h2>Add photos</h2>
                  <p className="section-hint">Listings with 5+ photos get 3× more tour requests.</p>
                  <label
                    className={`dropzone ${dragging ? 'dropzone--active' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => { e.preventDefault(); dragCounter.current++; setDragging(true); }}
                    onDragLeave={() => { dragCounter.current--; if (dragCounter.current <= 0) setDragging(false); }}
                    onDrop={onDrop}
                  >
                    <input
                      type="file" accept="image/*" multiple hidden
                      onChange={(e) => addFiles(e.target.files)}
                    />
                    <span className="dropzone__icon">📷</span>
                    <strong>Drag photos here, or click to browse</strong>
                    <span>JPG or PNG · up to 10 photos</span>
                  </label>
                  {errors.photos && <p className="field-error">{errors.photos}</p>}

                  {form.photos.length > 0 && (
                    <div className="photo-grid">
                      {form.photos.map((p, i) => (
                        <div className="photo-thumb" key={p.id}>
                          <img src={p.dataUrl} alt={p.name} />
                          {i === 0 && <span className="photo-thumb__cover">Cover</span>}
                          <button type="button" onClick={() => removePhoto(p.id)} aria-label="Remove photo">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {step === 4 && (
                <section>
                  <h2>Set your price</h2>
                  <div className="field-row-2">
                    <div className="field">
                      <label htmlFor="rent">Monthly rent (₹)</label>
                      <input
                        id="rent" type="number" placeholder="28500"
                        value={form.rent} onChange={(e) => update('rent', e.target.value)}
                        aria-invalid={!!errors.rent}
                      />
                      {errors.rent && <p className="field-error">{errors.rent}</p>}
                    </div>
                    <div className="field">
                      <label htmlFor="deposit">Security deposit (₹)</label>
                      <input
                        id="deposit" type="number" placeholder="57000"
                        value={form.deposit} onChange={(e) => update('deposit', e.target.value)}
                        aria-invalid={!!errors.deposit}
                      />
                      {errors.deposit && <p className="field-error">{errors.deposit}</p>}
                    </div>
                  </div>
                  <div className="field-row-2">
                    <div className="field">
                      <label htmlFor="maintenance">Maintenance / month (₹, optional)</label>
                      <input
                        id="maintenance" type="number" placeholder="1500"
                        value={form.maintenance} onChange={(e) => update('maintenance', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="availableFrom">Available from</label>
                      <input
                        id="availableFrom" type="date"
                        value={form.availableFrom} onChange={(e) => update('availableFrom', e.target.value)}
                        aria-invalid={!!errors.availableFrom}
                      />
                      {errors.availableFrom && <p className="field-error">{errors.availableFrom}</p>}
                    </div>
                  </div>
                  <label className="checkbox">
                    <input type="checkbox" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} />
                    <span>Rent is negotiable</span>
                  </label>
                </section>
              )}

              {step === 5 && (
                <section>
                  <h2>Review before you publish</h2>
                  <div className="review-list">
                    <ReviewRow label="Type" value={PROPERTY_TYPES.find((t) => t.id === form.type)?.label} onEdit={() => setStep(0)} />
                    <ReviewRow label="Title" value={form.title} onEdit={() => setStep(0)} />
                    <ReviewRow label="Address" value={`${form.address}, ${form.locality ? form.locality + ', ' : ''}${form.city} ${form.pincode}`} onEdit={() => setStep(1)} />
                    <ReviewRow label="Layout" value={`${form.bedrooms} bed · ${form.bathrooms} bath · ${form.area} sq ft · ${form.furnishing}`} onEdit={() => setStep(2)} />
                    <ReviewRow label="Amenities" value={form.amenities.length ? form.amenities.join(', ') : 'None selected'} onEdit={() => setStep(2)} />
                    <ReviewRow label="Photos" value={`${form.photos.length} uploaded`} onEdit={() => setStep(3)} />
                    <ReviewRow label="Price" value={`₹${form.rent}/mo · ₹${form.deposit} deposit${form.negotiable ? ' · negotiable' : ''}`} onEdit={() => setStep(4)} />
                  </div>
                </section>
              )}

              <div className="list-card__nav">
                {step > 0 && <button className="btn btn-ghost" onClick={goBack}>Back</button>}
                <span className="list-card__spacer" />
                {step < STEPS.length - 1 && (
                  <button className="btn btn-primary" onClick={goNext}>Continue</button>
                )}
                {step === STEPS.length - 1 && (
                  <button className="btn btn-primary" onClick={publish} disabled={publishing}>
                    {publishing ? 'Publishing…' : 'Publish listing'}
                  </button>
                )}
              </div>
            </div>

            {/* ── Live preview column ── */}
            <aside className="preview-card">
              <span className="eyebrow">Live preview</span>
              <div className="preview-card__media">
                {form.photos[0]
                  ? <img src={form.photos[0].dataUrl} alt="" />
                  : <span className="preview-card__placeholder">Photos will appear here</span>}
                {form.rent && (
                  <span className="preview-card__stamp">₹{Number(form.rent).toLocaleString('en-IN')}<small>/mo</small></span>
                )}
              </div>
              <div className="preview-card__body">
                <h3>{form.title || 'Your listing title'}</h3>
                <p>{form.city || 'City'}{form.locality ? `, ${form.locality}` : ''}</p>
                <div className="preview-card__specs">
                  <span>{form.bedrooms} bed</span>
                  <span>{form.bathrooms} bath</span>
                  <span>{form.area || '—'} sq ft</span>
                </div>
              </div>

              <div className="preview-card__completion">
                <div className="preview-card__completion-row">
                  <span>Profile completeness</span>
                  <strong>{completion}%</strong>
                </div>
                <div className="preview-card__bar">
                  <div style={{ width: `${completion}%` }} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      {authOpen && <AuthModal defaultTab="login" onClose={() => setAuthOpen(false)} />}
    </>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="review-row">
      <div>
        <span className="review-row__label">{label}</span>
        <p>{value || '—'}</p>
      </div>
      <button type="button" onClick={onEdit}>Edit</button>
    </div>
  );
}