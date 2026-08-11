import { useTranslation } from "../i18n/useTranslation.jsx";

function Story() {
  const { t } = useTranslation();
  return (
    <section id="story" className="story reveal">
      <div className="story-container">
        <div className="story-image">
          <img src="/images/logo.jpg" alt="Viktoria Kotekh" />
          <div className="story-badge">
            <strong>15+</strong>
            <span>{t('story_badge')}</span>
          </div>
        </div>
        <div className="story-text">
          <span className="section-label">{t('story_label')}</span>
          <h2 className="section-title">{t('story_title')}</h2>
          <div className="section-line left"></div>
          <p>{t('story_p1')}</p>
          <p>{t('story_p2')}</p>
          <p>{t('story_p3')}</p>
          <div className="story-flags">
            <span className="flag-tag">🇪🇬 Cairo, Egypt</span>
            <span className="flag-tag">🇪🇸 Madrid, Spain</span>
            <span className="flag-tag">🌍 International</span>
          </div>
          <a href="#booking" className="story-btn">{t('story_btn')}</a>
        </div>
      </div>
    </section>
  );
}

export default Story;