const SOCIALS = [
  { icon: "fa-brands fa-instagram", label: "Instagram", url: "https://instagram.com" },
  { icon: "fa-brands fa-facebook-f", label: "Facebook", url: "https://facebook.com" },
  { icon: "fa-brands fa-tiktok", label: "TikTok", url: "https://tiktok.com" },
  { icon: "fa-brands fa-x-twitter", label: "Twitter", url: "https://twitter.com" },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-brand">
          <h2>VIKTORIA KOTEKH</h2>
          <p>Couture & Alterations</p>
          <span className="footer-desc">
            Bespoke couture for the discerning woman.<br />
            Where European elegance meets Middle Eastern luxury.
          </span>
          <div className="footer-locations">
            <span>🇪🇬 Cairo</span>
            <span className="footer-loc-divider">·</span>
            <span>🇪🇸 Madrid</span>
          </div>
          <div className="footer-social-row">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                className="footer-social-link"
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="#">Home</a>
          <a href="#story">Our Story</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
          <a href="/blog">Journal</a>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <a href="#booking">Custom Bridal Design</a>
          <a href="#booking">Evening Wear</a>
          <a href="#booking">Alterations</a>
          <a href="#booking">Style Consultation</a>
          <a href="#booking">International Fittings</a>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>📞 +20 155 540 5699</p>
          <p>✉️ info@viktoriakotekh.com</p>
          <p>📍 Cairo, Egypt</p>
          <p>✈️ Madrid, Spain</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Viktoria Kotekh. All rights reserved.</p>
        <p>Crafted with passion · Cairo & Madrid</p>
      </div>
    </footer>
  );
}

export default Footer;