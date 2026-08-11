import { useTranslation } from "../i18n/useTranslation.jsx";

function Hero() {
  const { t } = useTranslation();
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
          <a href="#Viewcollection" className="btn-outline">{t('hero_btn2')}</a>
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