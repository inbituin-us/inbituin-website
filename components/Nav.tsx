import Image from "next/image";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="/map">
          <Image
            className="nav__brand-mark"
            src="/assets/philippine-sun.png"
            alt=""
            width={28}
            height={28}
          />
          <span className="nav__brand-text">In Bituin</span>
        </a>
        <div className="nav__links">
          <a className="nav__link" href="#">About</a>
          <a className="nav__link" href="#">Programme</a>
          <a className="nav__link" href="#">Gallery</a>
          <a className="nav__link nav__link--active" href="/map">Constellation Map</a>
        </div>
        <a className="nav__rsvp" href="#">RSVP</a>
      </div>
    </nav>
  );
}
