import { useState, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <a href="#" onClick={close}>
            <img src="/images/logo.jpg" alt="Viktoria Kotekh" />
            <div className="logo-text">
              <h1>VIKTORIA KOTEKH</h1>
              <p>Couture & Alterations</p>
            </div>
          </a>
        </div>

        {/* القايمة */}
        <div className={`nav-links ${open ? "active" : ""}`}>
          <a href="#story" onClick={close}>Our Story</a>
          <a href="#services" onClick={close}>Services</a>
          <a href="#gallery" onClick={close}>Gallery</a>
          <a href="#reviews" onClick={close}>Reviews</a>
          <a href="/blog" onClick={close}>Journal</a>
          <a href="#contact" onClick={close}>Contact</a>
          <a href="#booking" onClick={close} className="nav-cta">Book a Fitting</a>
        </div>

        {/* زرار الهامبرغر */}
        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="2" y1="2" x2="18" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="18" y1="2" x2="2" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1" x2="22" y2="1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="8" x2="22" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="15" x2="22" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <div className={`menu-overlay ${open ? "active" : ""}`} onClick={close}></div>
      </nav>
    </>
  );
}

export default Navbar;