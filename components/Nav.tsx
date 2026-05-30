export default function Nav() {
  const rsvpUrl = "https://partiful.com/e/q0vog3c2ldApTwNfSQbL?c=8NqPm6FG";

  return (
    <nav className="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="/map">
          <span
            className="nav__brand-mark"
            aria-hidden="true"
          />
          <span className="nav__brand-text">
            <span className="nav__brand-eyebrow">In Bituin</span>
            <span className="nav__brand-title">The Living Canvas</span>
          </span>
        </a>
        <div className="nav__links">
          <a className="nav__link nav__link--active" href="/map">Constellation Map</a>
        </div>
        <a className="nav__rsvp" href={rsvpUrl} target="_blank" rel="noopener">
          RSVP
        </a>
      </div>
    </nav>
  );
}
