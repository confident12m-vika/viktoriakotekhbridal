import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SOCIALS = [
  { icon: "fa-brands fa-instagram", label: "Instagram", url: "https://instagram.com" },
  { icon: "fa-brands fa-facebook-f", label: "Facebook", url: "https://facebook.com" },
  { icon: "fa-brands fa-tiktok", label: "TikTok", url: "https://tiktok.com" },
  { icon: "fa-brands fa-x-twitter", label: "Twitter", url: "https://twitter.com" },
];

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function subscribe(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus(err.message === "Already subscribed" ? "already" : "error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <p style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "12px" }}>
        Subscribe for exclusive offers
      </p>
      {status === "success" ? (
        <p style={{ color: "#c9a84c", fontSize: "12px", letterSpacing: "1px" }}>
          ✓ Thank you for subscribing!
        </p>
      ) : (
        <form onSubmit={subscribe} style={{ display: "flex", gap: "0" }}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              flex: 1, padding: "10px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRight: "none",
              color: "white", fontFamily: "'Jost',sans-serif",
              fontSize: "12px", outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "10px 16px",
              background: "#c9a84c", color: "#0a0a0a",
              border: "none", cursor: "pointer",
              fontFamily: "'Jost',sans-serif",
              fontSize: "10px", letterSpacing: "1px",
              whiteSpace: "nowrap",
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "already" && (
        <p style={{ color: "#c9a84c", fontSize: "11px", marginTop: "6px" }}>Already subscribed ✓</p>
      )}
      {status === "error" && (
        <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "6px" }}>Something went wrong. Try again.</p>
      )}
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>VIKTORIA KOTEKH</h2>
          <p>Couture & Alterations</p>
          <span className="footer-desc">
            {t('footer_tagline')}<br />{t('footer_sub')}
          </span>
          <div className="footer-locations">
            <span>🇪🇬 Cairo</span>
            <span className="footer-loc-divider">·</span>
            <span>🇪🇸 Madrid</span>
          </div>
          <div className="footer-social-row">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.url} className="footer-social-link"
                target="_blank" rel="noreferrer" aria-label={s.label}>
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
          {/* Newsletter جوه الفوتر */}
          <Newsletter />
        </div>

        <div className="footer-col">
          <h4>{t('footer_nav')}</h4>
          <a href="#">{t('footer_home')}</a>
          <a href="#story">{t('nav_story')}</a>
          <a href="#services">{t('nav_services')}</a>
          <a href="#gallery">{t('nav_gallery')}</a>
          <a href="#contact">{t('nav_contact')}</a>
          <a href="/blog">{t('nav_journal')}</a>
          <a href="/collection">View Collection</a>
        </div>

        <div className="footer-col">
          <h4>{t('footer_services')}</h4>
          {Array.isArray(t('booking_services')) && t('booking_services').slice(0,5).map((s,i) => (
            <a key={i} href="#booking">{s}</a>
          ))}
        </div>

        <div className="footer-col">
          <h4>{t('footer_contact')}</h4>
          <p>📞 +20 155 883 1957</p>
          <p>✉️ info@viktoriakotekhbridal.com</p>
          <p>📍 Cairo, Egypt</p>
          <p>✈️ Madrid, Spain</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer_rights')}</p>
        <p>{t('footer_crafted')}</p>
      </div>
    </footer>
  );
}

export default Footer;