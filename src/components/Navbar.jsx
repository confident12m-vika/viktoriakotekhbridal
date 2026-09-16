import { useState, useEffect } from "react";
import { useTranslation, LangSwitcher, LangSwitcherMobile } from "../i18n/useTranslation.jsx";

function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, setLang }    = useTranslation();

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
        {/* اللوجو */}
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
          <a href="#story"    onClick={close}>{t('nav_story')}</a>
          <a href="#services" onClick={close}>{t('nav_services')}</a>
          <a href="#gallery"  onClick={close}>{t('nav_gallery')}</a>
          <a href="#reviews"  onClick={close}>{t('nav_reviews')}</a>
          <a href="/blog"     onClick={close}>{t('nav_journal')}</a>
          <a href="#contact"  onClick={close}>{t('nav_contact')}</a>
          <a href="#booking"  onClick={close} className="nav-cta">{t('nav_book')}</a>
          {/* اللغة جوه القايمة على الموبايل */}
          <div className="lang-mobile-slot">
            <LangSwitcherMobile lang={lang} setLang={setLang} onClose={close} />
          </div>
        </div>

        {/* يمين: كرة أرضية صغيرة + هامبرغر */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* ديسكتوب: dropdown كامل */}
          <div className="lang-desktop-slot">
            <LangSwitcher lang={lang} setLang={setLang} />
          </div>

          {/* موبايل: أيقونة كرة صغيرة فقط تفتح القايمة */}
          <button
            className="lang-mobile-globe"
            onClick={() => setOpen(o => !o)}
            aria-label="Language"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </button>

          {/* هامبرغر */}
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
        </div>

        <div className={`menu-overlay ${open ? "active" : ""}`} onClick={close}></div>
      </nav>
    </>
  );
}

export default Navbar;