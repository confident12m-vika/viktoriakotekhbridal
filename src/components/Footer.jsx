import { useTranslation } from "../i18n/useTranslation.jsx";

const SOCIALS = [
  { icon: "fa-brands fa-instagram", label: "Instagram", url: "https://instagram.com" },
  { icon: "fa-brands fa-facebook-f", label: "Facebook", url: "https://facebook.com" },
  { icon: "fa-brands fa-tiktok", label: "TikTok", url: "https://tiktok.com" },
  { icon: "fa-brands fa-x-twitter", label: "Twitter", url: "https://twitter.com" },
];

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
              <a key={s.label} href={s.url} className="footer-social-link" target="_blank" rel="noreferrer" aria-label={s.label}>
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer_nav')}</h4>
          <a href="#">{t('footer_home')}</a>
          <a href="#story">{t('nav_story')}</a>
          <a href="#services">{t('nav_services')}</a>
          <a href="#gallery">{t('nav_gallery')}</a>
          <a href="#contact">{t('nav_contact')}</a>
          <a href="/blog">{t('nav_journal')}</a>
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
          <p>✉️ info@viktoriakotekh.com</p>
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