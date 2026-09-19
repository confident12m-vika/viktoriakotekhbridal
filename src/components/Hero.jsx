import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n/useTranslation.jsx";

function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="hero">
      <img src="/images/myimg.jpg" className="hero-img" alt="Viktoria Kotekh Couture" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="hero-tag">{t('hero_tag')}</span>
        <h1 className="hero-title">
          {t('hero_title1')} <em>{t('hero_title_em')}</em><br />{t('hero_title2')}
        </h1>
        <p className="hero-description">{t('hero_desc')}</p>
        <div className="hero-btns">
          <a href="#booking" className="btn-gold">{t('hero_btn1')}</a>
          {/* زرار View Collection يروح صفحة /collection */}
          <button className="btn-outline" onClick={() => navigate('/collection')}>
            {t('hero_btn2')}
          </button>
          {/* زرار المتجر */}
          <a
            href="https://viktoriakotekhbridal.online"
            className="btn-store"
            target="_blank"
            rel="noreferrer"
          >
            {t('hero_btn_store')}
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>{t('hero_scroll')}</span>
        <div className="scroll-line"></div>
      </div>
    </header>
  );
}

export default Hero;